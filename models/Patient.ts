import mongoose, { Document, Schema } from 'mongoose';

export interface IMedication {
  name: string;
  dosage: string;
  times: string[];
  notes?: string;
}

export interface IPatient extends Document {
  name: string;
  email: string;
  mobileNumber: string;
  parentGuardianNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medications: IMedication[];
  reminderPreferences: {
    sms: boolean;
    voiceCall: boolean;
    email: boolean;
  };
  status: 'active' | 'paused' | 'completed';
  avatar?: string;
  notes?: string;
  lastReminderSent?: Date;
  nextReminderDue?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dosage: {
    type: String,
    required: true,
    trim: true,
  },
  times: [{
    type: String,
    required: true,
  }],
  notes: {
    type: String,
    trim: true,
  },
});

const PatientSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  parentGuardianNumber: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  address: {
    type: String,
    trim: true,
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true,
    },
    relationship: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
  },
  medications: [MedicationSchema],
  reminderPreferences: {
    sms: {
      type: Boolean,
      default: true,
    },
    voiceCall: {
      type: Boolean,
      default: true,
    },
    email: {
      type: Boolean,
      default: false,
    },
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active',
  },
  avatar: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    trim: true,
  },
  lastReminderSent: {
    type: Date,
  },
  nextReminderDue: {
    type: Date,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);