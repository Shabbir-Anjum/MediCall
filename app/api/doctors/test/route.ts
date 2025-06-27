import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log('Test API received:', body);

    // Create a simple doctor without authentication for testing
    const doctor = new Doctor({
      ...body,
      createdBy: '507f1f77bcf86cd799439011', // Mock user ID for testing
    });

    await doctor.save();
    console.log('Doctor saved successfully:', doctor);

    return NextResponse.json({ doctor }, { status: 201 });
  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create doctor' },
      { status: 500 },
    );
  }
}
