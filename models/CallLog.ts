import mongoose, { Document, Schema } from 'mongoose';

export interface ICallLog extends Document {
  patient: mongoose.Types.ObjectId;
  agent: mongoose.Types.ObjectId;
  callType: 'reminder' | 'appointment' | 'emergency' | 'follow-up';
  outcome: 'completed' | 'no-answer' | 'busy' | 'transferred-emergency' | 'appointment-requested';
  duration?: number;
  transcript?: string;
  audioRecording?: string;
  callDateTime: Date;
  blandAiCallId?: string;
  emergencyTransferDetails?: {
    transferredAt: Date;
    emergencyNumber: string;
    status: 'pending' | 'connected' | 'completed';
  };
  appointmentDetails?: {
    requestedDate: Date;
    requestedTime: string;
    symptoms: string;
    booking?: mongoose.Types.ObjectId;
  };
  reminderDetails?: {
    medicationName: string;
    dosage: string;
    nextDue: Date;
  };
  remarks?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CallLogSchema: Schema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent is required'],
    },
    callType: {
      type: String,
      enum: ['reminder', 'appointment', 'emergency', 'follow-up'],
      required: true,
    },
    outcome: {
      type: String,
      enum: ['completed', 'no-answer', 'busy', 'transferred-emergency', 'appointment-requested'],
      required: true,
    },
    duration: {
      type: Number,
      min: 0,
    },
    transcript: {
      type: String,
      trim: true,
    },
    audioRecording: {
      type: String,
      trim: true,
    },
    callDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    blandAiCallId: {
      type: String,
      trim: true,
    },
    emergencyTransferDetails: {
      transferredAt: {
        type: Date,
      },
      emergencyNumber: {
        type: String,
        trim: true,
      },
      status: {
        type: String,
        enum: ['pending', 'connected', 'completed'],
      },
    },
    appointmentDetails: {
      requestedDate: {
        type: Date,
      },
      requestedTime: {
        type: String,
      },
      symptoms: {
        type: String,
        trim: true,
      },
      booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
      },
    },
    reminderDetails: {
      medicationName: {
        type: String,
        trim: true,
      },
      dosage: {
        type: String,
        trim: true,
      },
      nextDue: {
        type: Date,
      },
    },
    remarks: {
      type: String,
      trim: true,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.CallLog || mongoose.model<ICallLog>('CallLog', CallLogSchema);
