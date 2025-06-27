import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import { UpdateDoctorSchema } from '@/types/doctor';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const doctor = await Doctor.findById(params.id).lean();

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json({ doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    // Validate input
    const validatedData = UpdateDoctorSchema.parse(body);

    // Check if doctor exists
    const existingDoctor = await Doctor.findById(params.id);
    if (!existingDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Check if email or license number conflicts with other doctors
    if (validatedData.email || validatedData.licenseNumber) {
      const conflictQuery: any = { _id: { $ne: params.id } };

      if (validatedData.email) {
        conflictQuery.email = validatedData.email;
      }
      if (validatedData.licenseNumber) {
        conflictQuery.licenseNumber = validatedData.licenseNumber;
      }

      const conflictingDoctor = await Doctor.findOne(conflictQuery);
      if (conflictingDoctor) {
        return NextResponse.json(
          { error: 'Doctor with this email or license number already exists' },
          { status: 400 },
        );
      }
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      params.id,
      { ...validatedData, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    return NextResponse.json({ doctor: updatedDoctor });
  } catch (error: any) {
    console.error('Error updating doctor:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const doctor = await Doctor.findById(params.id);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Soft delete - set isActive to false
    await Doctor.findByIdAndUpdate(params.id, { isActive: false });

    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { availabilityStatus } = body;

    if (!availabilityStatus || !['online', 'offline', 'on-leave'].includes(availabilityStatus)) {
      return NextResponse.json({ error: 'Invalid availability status' }, { status: 400 });
    }

    const doctor = await Doctor.findById(params.id);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      params.id,
      { availabilityStatus },
      { new: true },
    );

    return NextResponse.json({ doctor: updatedDoctor });
  } catch (error) {
    console.error('Error updating doctor status:', error);
    return NextResponse.json({ error: 'Failed to update doctor status' }, { status: 500 });
  }
}
