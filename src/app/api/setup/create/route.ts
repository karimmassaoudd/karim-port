import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if this is truly the first user
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Setup has already been completed' },
        { status: 403 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create first admin user
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create admin account' },
      { status: 500 }
    );
  }
}
