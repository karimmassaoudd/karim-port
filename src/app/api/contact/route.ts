import { promises as fs } from "node:fs";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node APIs (fs) are available

// Location of the JSON "database"
const dataFile = path.join(process.cwd(), "src", "data", "contacts.json");

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  phone?: string;
}

interface ContactItem {
  id: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  createdAt: string;
}

// Basic validation helper
function validate(body: ContactBody) {
  const errors: string[] = [];
  if (!body) errors.push("Missing body");
  if (!body.name || typeof body.name !== "string") errors.push("Invalid name");
  if (!body.email || typeof body.email !== "string")
    errors.push("Invalid email");
  if (!body.message || typeof body.message !== "string")
    errors.push("Invalid message");
  // phone optional
  return errors;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = validate(body);
    if (errors.length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // Ensure file exists
    try {
      await fs.access(dataFile);
    } catch {
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      await fs.writeFile(dataFile, "[]", "utf8");
    }

    const raw = await fs.readFile(dataFile, "utf8");
    const list = JSON.parse(raw || "[]") as ContactItem[];

    const item = {
      id: crypto.randomUUID(),
      name: String(body.name).trim(),
      email: String(body.email).trim(),
      phone: body.phone ? String(body.phone).trim() : "",
      message: String(body.message).trim(),
      createdAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "",
      ip: req.headers.get("x-forwarded-for") || "",
    };

    list.push(item);
    await fs.writeFile(dataFile, JSON.stringify(list, null, 2), "utf8");

    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (err) {
    console.error("/api/contact POST error", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const raw = await fs.readFile(dataFile, "utf8").catch(() => "[]");
    const list = JSON.parse(raw || "[]");
    return NextResponse.json({ ok: true, list });
  } catch (err) {
    console.error("/api/contact GET error", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
