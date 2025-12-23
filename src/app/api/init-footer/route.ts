import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

// POST - Initialize footer data in existing document
export async function POST() {
  try {
    await dbConnect();

    const defaultFooter = {
      ownerName: "Karim Massaoud",
      ownerTitle: "Web Developer",
      ownerInitial: "K",
      ownerAvatarUrl: "",
      email: "karimmassoud668@gmail.com",
      phone: "0616537940",
      location: "",
      copyrightText: "© 2024 Portfolio Admin",
      socialLinks: [
        {
          id: 1,
          platform: "LinkedIn",
          url: "https://linkedin.com",
          icon: "linkedin",
          isVisible: true,
        },
        {
          id: 2,
          platform: "GitHub",
          url: "https://github.com",
          icon: "github",
          isVisible: true,
        },
      ],
    };

    // Use raw MongoDB update to bypass schema validation
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }

    const result = await mongoose.connection.db
      .collection("homepages")
      .updateOne({}, { $set: { footer: defaultFooter } });

    const doc = await mongoose.connection.db
      .collection("homepages")
      .findOne({});

    return NextResponse.json({
      success: true,
      modified: result.modifiedCount > 0,
      footer: doc?.footer,
    });
  } catch (error) {
    console.error("Error initializing footer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize footer" },
      { status: 500 },
    );
  }
}
