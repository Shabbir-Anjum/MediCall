import mongoose, { Document, Schema } from 'mongoose';

export interface IMedication {
  name: string;
  dosage: string;
  times: string[];
  notes?: string;
  prescribingDoctor?: string;
  pharmacy?: string;
  prescriptionNumber?: string;
  refillDate?: Date;
  sideEffects?: string[];
  drugInteractions?: string[];
  instructions?: string;
  isActive: boolean;
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
  prescriptionImages: string[]; // Array of image file paths
  lastReminderSent?: Date;
  nextReminderDue?: Date;
  allergies?: string[];
  medicalHistory?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  primaryCarePhysician?: {
    name: string;
    phone: string;
    email?: string;
  };
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
  times: [
    {
      type: String,
      required: true,
    },
  ],
  notes: {
    type: String,
    trim: true,
  },
  prescribingDoctor: {
    type: String,
    trim: true,
  },
  pharmacy: {
    type: String,
    trim: true,
  },
  prescriptionNumber: {
    type: String,
    trim: true,
  },
  refillDate: {
    type: Date,
  },
  sideEffects: [
    {
      type: String,
      trim: true,
    },
  ],
  drugInteractions: [
    {
      type: String,
      trim: true,
    },
  ],
  instructions: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const PatientSchema: Schema = new Schema(
  {
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
    prescriptionImages: [
      {
        type: String,
        trim: true,
      },
    ],
    lastReminderSent: {
      type: Date,
    },
    nextReminderDue: {
      type: Date,
    },
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    medicalHistory: {
      type: String,
      trim: true,
    },
    insuranceInfo: {
      provider: {
        type: String,
        trim: true,
      },
      policyNumber: {
        type: String,
        trim: true,
      },
      groupNumber: {
        type: String,
        trim: true,
      },
    },
    primaryCarePhysician: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
