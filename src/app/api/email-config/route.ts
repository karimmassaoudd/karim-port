import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EmailConfig from '@/models/EmailConfig';

// GET email configuration
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    let emailConfig = await EmailConfig.findOne();
    
    if (!emailConfig) {
      // Return empty if not configured yet
      return NextResponse.json({
        success: true,
        data: {
          gmailUser: '',
          gmailAppPassword: '',
          configured: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        gmailUser: emailConfig.gmailUser,
        // Don't send the full password, just indicate it exists
        gmailAppPassword: emailConfig.gmailAppPassword ? '••••••••••••••••' : '',
        configured: true,
      },
    });
  } catch (error) {
    console.error('Error fetching email config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch email configuration' },
      { status: 500 }
    );
  }
}

// PUT update email configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { gmailUser, gmailAppPassword } = await request.json();

    if (!gmailUser || !gmailAppPassword) {
      return NextResponse.json(
        { success: false, error: 'Gmail user and app password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmailUser)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if config exists
    let emailConfig = await EmailConfig.findOne();

    if (emailConfig) {
      // Update existing
      emailConfig.gmailUser = gmailUser;
      emailConfig.gmailAppPassword = gmailAppPassword;
      emailConfig.updatedAt = new Date();
      await emailConfig.save();
    } else {
      // Create new
      emailConfig = await EmailConfig.create({
        gmailUser,
        gmailAppPassword,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating email config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update email configuration' },
      { status: 500 }
    );
  }
}
