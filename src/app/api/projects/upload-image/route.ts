import { type NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";

// Increase route timeout to 2 minutes for large uploads
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 },
      );
    }

    // Validate file types and sizes
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        errors.push({
          filename: file.name,
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and AVIF are allowed.",
        });
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        errors.push({
          filename: file.name,
          error: "File size exceeds 10MB limit",
        });
        continue;
      }

      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary with timeout handling
        const result = await uploadToCloudinary(buffer, "portfolio/projects");

        results.push({
          url: result.url,
          publicId: result.publicId,
          filename: file.name,
          alt: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for alt text
        });
      } catch (uploadError: any) {
        console.error(`Upload error for ${file.name}:`, uploadError);
        
        let errorMessage = "Failed to upload file";
        if (uploadError?.message) {
          errorMessage = uploadError.message;
        } else if (uploadError?.error?.message) {
          errorMessage = uploadError.error.message;
        }
        
        errors.push({
          filename: file.name,
          error: errorMessage,
        });
      }
    }

    // Return results
    if (results.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { success: false, error: "All uploads failed", errors },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      uploads: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully uploaded ${results.length} of ${files.length} files`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload files" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "No publicId provided" },
        { status: 400 },
      );
    }

    await deleteFromCloudinary(publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
