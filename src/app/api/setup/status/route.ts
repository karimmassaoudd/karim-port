import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      needsSetup: userCount === 0,
    });
  } catch (error) {
    console.error('Error checking setup status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check setup status' },
      { status: 500 }
    );
  }
}
