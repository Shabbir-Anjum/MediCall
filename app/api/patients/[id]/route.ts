import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { PatientSchema, ApiError } from '@/types/patient';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;

    const patient = await Patient.findById(id).populate('createdBy', 'name email');

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Return patient data
    const response = {
      ...patient.toObject(),
      _id: patient._id.toString(),
      createdBy: {
        _id: patient.createdBy._id.toString(),
        name: patient.createdBy.name,
        email: patient.createdBy.email,
      },
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
      dateOfBirth: patient.dateOfBirth?.toISOString(),
      lastReminderSent: patient.lastReminderSent?.toISOString(),
      nextReminderDue: patient.nextReminderDue?.toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching patient:', error);
    const errorResponse: ApiError = { error: 'Failed to fetch patient' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;
    const body = await request.json();

    // Validate input data
    const validationResult = PatientSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 },
      );
    }

    // Find and update patient
    const patient = await Patient.findByIdAndUpdate(id, validationResult.data, {
      new: true,
    }).populate('createdBy', 'name email');

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Return updated patient
    const response = {
      ...patient.toObject(),
      _id: patient._id.toString(),
      createdBy: {
        _id: patient.createdBy._id.toString(),
        name: patient.createdBy.name,
        email: patient.createdBy.email,
      },
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
      dateOfBirth: patient.dateOfBirth?.toISOString(),
      lastReminderSent: patient.lastReminderSent?.toISOString(),
      nextReminderDue: patient.nextReminderDue?.toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating patient:', error);

    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern?.email) {
      return NextResponse.json(
        { error: 'A patient with this email already exists' },
        { status: 409 },
      );
    }

    const errorResponse: ApiError = { error: 'Failed to update patient' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    const errorResponse: ApiError = { error: 'Failed to delete patient' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
