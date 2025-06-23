import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CallLog from '@/models/CallLog';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const outcome = searchParams.get('outcome');
    const callType = searchParams.get('callType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let query: any = {};
    
    if (outcome && outcome !== 'all') {
      query.outcome = outcome;
    }
    
    if (callType && callType !== 'all') {
      query.callType = callType;
    }
    
    if (startDate && endDate) {
      query.callDateTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    const callLogs = await CallLog.find(query)
      .populate('patient', 'name email mobileNumber avatar')
      .populate('agent', 'name email avatar')
      .sort({ callDateTime: -1 });
    
    return NextResponse.json({ callLogs });
  } catch (error) {
    console.error('Error fetching call logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch call logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const callLog = new CallLog(body);
    await callLog.save();
    
    return NextResponse.json({ callLog }, { status: 201 });
  } catch (error) {
    console.error('Error creating call log:', error);
    return NextResponse.json(
      { error: 'Failed to create call log' },
      { status: 500 }
    );
  }
}