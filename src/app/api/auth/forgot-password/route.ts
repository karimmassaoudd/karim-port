import crypto from "node:crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import EmailConfig from "@/models/EmailConfig";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found with this email" },
        { status: 404 },
      );
    }

    // Get email configuration from database
    const emailConfig = await EmailConfig.findOne();

    if (
      !emailConfig ||
      !emailConfig.gmailUser ||
      !emailConfig.gmailAppPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service not configured. Please contact administrator to set up email settings.",
        },
        { status: 503 },
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    // Send email using database configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailConfig.gmailUser,
        pass: emailConfig.gmailAppPassword,
      },
    });

    const mailOptions = {
      from: emailConfig.gmailUser,
      to: email,
      subject: "Password Reset Request - Karim Portfolio",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy this link:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send reset email" },
      { status: 500 },
    );
  }
}
