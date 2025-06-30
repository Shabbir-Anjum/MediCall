import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import {
  PatientSchema,
  PatientsListResponse,
  CreatePatientResponse,
  ApiError,
} from '@/types/patient';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query: any = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const patients = await Patient.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const response: PatientsListResponse = {
      patients: patients.map((patient: any) => ({
        _id: patient._id.toString(),
        name: patient.name,
        email: patient.email,
        mobileNumber: patient.mobileNumber,
        parentGuardianNumber: patient.parentGuardianNumber,
        dateOfBirth: patient.dateOfBirth?.toISOString(),
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        medications: patient.medications,
        reminderPreferences: patient.reminderPreferences,
        status: patient.status,
        avatar: patient.avatar,
        notes: patient.notes,
        prescriptionImages: patient.prescriptionImages || [],
        lastReminderSent: patient.lastReminderSent?.toISOString(),
        nextReminderDue: patient.nextReminderDue?.toISOString(),
        createdBy: {
          _id: patient.createdBy._id.toString(),
          name: patient.createdBy.name,
          email: patient.createdBy.email,
        },
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching patients:', error);
    const errorResponse: ApiError = { error: 'Failed to fetch patients' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    // Validate input data
    const validationResult = PatientSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.errors);
      return NextResponse.json(
        {
          error: 'Invalid data',
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // Create patient with validated data
    const patient = new Patient({
      ...validationResult.data,
      createdBy: session.user.id,
    });

    await patient.save();

    // Populate createdBy field
    await patient.populate('createdBy', 'name email');

    const response: CreatePatientResponse = {
      patient: {
        _id: patient._id.toString(),
        name: patient.name,
        email: patient.email,
        mobileNumber: patient.mobileNumber,
        parentGuardianNumber: patient.parentGuardianNumber,
        dateOfBirth: patient.dateOfBirth?.toISOString(),
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        medications: patient.medications,
        reminderPreferences: patient.reminderPreferences,
        status: patient.status,
        avatar: patient.avatar,
        notes: patient.notes,
        prescriptionImages: patient.prescriptionImages || [],
        lastReminderSent: patient.lastReminderSent?.toISOString(),
        nextReminderDue: patient.nextReminderDue?.toISOString(),
        createdBy: {
          _id: patient.createdBy._id.toString(),
          name: patient.createdBy.name,
          email: patient.createdBy.email,
        },
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);

    // Handle duplicate email error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 11000 &&
      'keyPattern' in error &&
      error.keyPattern &&
      typeof error.keyPattern === 'object' &&
      'email' in error.keyPattern
    ) {
      return NextResponse.json(
        { error: 'A patient with this email already exists' },
        { status: 409 },
      );
    }

    // Handle validation errors from Mongoose
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 },
      );
    }

    const errorResponse: ApiError = { error: 'Failed to create patient' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
