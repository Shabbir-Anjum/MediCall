import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import { CreateDoctorSchema } from '@/types/doctor';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query: any = { isActive: true };

    if (specialty && specialty !== 'all') {
      query.specialty = specialty;
    }

    if (status && status !== 'all') {
      query.availabilityStatus = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [doctors, total] = await Promise.all([
      Doctor.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Doctor.countDocuments(query),
    ]);

    return NextResponse.json({
      doctors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await dbConnect();

    const body = await request.json();
    console.log('API received body:', body); // Debug log

    // Validate input
    const validatedData = CreateDoctorSchema.parse(body);
    console.log('Validated data:', validatedData); // Debug log

    // Check if doctor with same email or license number already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email: validatedData.email }, { licenseNumber: validatedData.licenseNumber }],
    });

    if (existingDoctor) {
      return NextResponse.json(
        { error: 'Doctor with this email or license number already exists' },
        { status: 400 },
      );
    }

    const doctor = new Doctor({
      ...validatedData,
      createdBy: '507f1f77bcf86cd799439011', // Mock user ID for testing
    });

    console.log('About to save doctor:', doctor); // Debug log
    await doctor.save();
    console.log('Doctor saved successfully'); // Debug log

    return NextResponse.json({ doctor }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating doctor:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
