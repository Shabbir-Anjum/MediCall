import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CallLog from '@/models/CallLog';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Process Bland.ai webhook data
    const {
      call_id,
      status,
      transcript,
      duration,
      metadata,
    } = body;
    
    // Find existing call log or create new one
    let callLog = await CallLog.findOne({ blandAiCallId: call_id });
    
    if (callLog) {
      // Update existing call log
      callLog.transcript = transcript;
      callLog.duration = duration;
      
      if (status === 'completed') {
        callLog.outcome = 'completed';
      } else if (status === 'no-answer') {
        callLog.outcome = 'no-answer';
      } else if (status === 'busy') {
        callLog.outcome = 'busy';
      }
      
      await callLog.save();
    } else {
      // Create new call log if metadata contains patient info
      if (metadata?.patient_id && metadata?.agent_id) {
        callLog = new CallLog({
          patient: metadata.patient_id,
          agent: metadata.agent_id,
          callType: metadata.call_type || 'reminder',
          outcome: status === 'completed' ? 'completed' : 'no-answer',
          duration,
          transcript,
          blandAiCallId: call_id,
          callDateTime: new Date(),
        });
        
        await callLog.save();
      }
    }
    
    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing Bland.ai webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}