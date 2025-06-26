import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import { elevenLabsService } from '@/lib/elevenlabs';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const doctorId = params.id;
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Update status to pending
    doctor.voiceCloneStatus = 'pending';
    await doctor.save();

    try {
      // Clone voice with ElevenLabs
      const voiceCloneResult = await elevenLabsService.cloneVoice(
        audioFile,
        `Dr. ${doctor.name}`,
        `Voice clone for Dr. ${doctor.name} - ${doctor.specialty}`,
      );

      // Update doctor with voice ID
      doctor.voiceId = voiceCloneResult.voice_id;
      doctor.voiceCloneStatus = 'completed';
      await doctor.save();

      return NextResponse.json({
        message: 'Voice cloned successfully',
        voiceId: voiceCloneResult.voice_id,
        doctor: {
          id: doctor._id,
          name: doctor.name,
          voiceId: doctor.voiceId,
          voiceCloneStatus: doctor.voiceCloneStatus,
        },
      });
    } catch (error) {
      // Update status to failed
      doctor.voiceCloneStatus = 'failed';
      await doctor.save();

      console.error('Voice cloning failed:', error);
      return NextResponse.json({ error: 'Failed to clone voice' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in voice cloning endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
