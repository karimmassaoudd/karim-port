import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Upload buffer to Cloudinary
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "portfolio",
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    // Set a timeout of 2 minutes
    const timeout = setTimeout(() => {
      reject(new Error("Upload timeout - please try again with a smaller file or compress it first"));
    }, 120000);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
        timeout: 120000, // 2 minute timeout for Cloudinary
        chunk_size: 6000000, // 6MB chunks for better handling
        transformation: [
          { width: 1600, height: 1600, crop: "limit" }, // Smaller size for faster uploads
          { quality: "auto:low" }, // Lower quality for faster uploads
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        clearTimeout(timeout);
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error("No result from Cloudinary"));
        }
      },
    );
    uploadStream.end(buffer);
  });
}

// Delete from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
