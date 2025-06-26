import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { userRegistrationSchema, hashPassword } from '@/lib/auth-utils';

// POST - Public user registration (no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = userRegistrationSchema.parse(body);

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user (default to agent role for public signup)
    const user = new User({
      ...validatedData,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      role: 'agent', // Default role for public signups
      isActive: true,
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json({
      user: userResponse,
      message: 'Account created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);

    if (error instanceof Error && error.message.includes('validation failed')) {
      return NextResponse.json(
        { error: 'Invalid input data. Please check your information.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
