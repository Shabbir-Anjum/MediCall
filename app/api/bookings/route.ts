import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      query.appointmentDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const bookings = await Booking.find(query)
      .populate('patient', 'name email mobileNumber avatar')
      .populate('doctor', 'name specialty avatar')
      .populate('createdBy', 'name email')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // In a real app, you'd get the user ID from the session
    const createdBy = '507f1f77bcf86cd799439011'; // Mock user ID

    const booking = new Booking({
      ...body,
      createdBy,
    });

    await booking.save();

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
