import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { ApiError } from '@/types/patient';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['active', 'paused', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active, paused, or completed' },
        { status: 400 },
      );
    }

    // Find and update patient
    const patient = await Patient.findByIdAndUpdate(id, { status }, { new: true }).populate(
      'createdBy',
      'name email',
    );

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
    console.error('Error updating patient status:', error);
    const errorResponse: ApiError = { error: 'Failed to update patient status' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
