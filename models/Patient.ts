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
    required: [true, 'Medication name is required'],
    trim: true,
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    trim: true,
  },
  times: [
    {
      type: String,
      required: [true, 'At least one medication time is required'],
      trim: true,
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
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      minlength: [10, 'Mobile number must be at least 10 digits'],
    },
    parentGuardianNumber: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          if (!value) return true; // Optional field
          return value <= new Date();
        },
        message: 'Date of birth cannot be in the future',
      },
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
    medications: {
      type: [MedicationSchema],
      required: [true, 'At least one medication is required'],
      validate: {
        validator: function (medications: IMedication[]) {
          return medications.length > 0;
        },
        message: 'At least one medication is required',
      },
    },
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
      enum: {
        values: ['active', 'paused', 'completed'],
        message: 'Status must be active, paused, or completed',
      },
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
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required'],
    },
  },
  {
    timestamps: true,
  },
);

// Add indexes for better query performance
PatientSchema.index({ email: 1 });
PatientSchema.index({ mobileNumber: 1 });
PatientSchema.index({ status: 1 });
PatientSchema.index({ createdBy: 1 });
PatientSchema.index({ createdAt: -1 });

// Compound index for search functionality
PatientSchema.index({
  name: 'text',
  email: 'text',
  mobileNumber: 'text',
});

// Pre-save middleware to validate emergency contact
PatientSchema.pre('save', function (next) {
  const patient = this as any;

  // If emergency contact is provided, all fields must be present
  if (patient.emergencyContact) {
    const { name, relationship, phoneNumber } = patient.emergencyContact;
    if (!name || !relationship || !phoneNumber) {
      return next(new Error('Emergency contact must have name, relationship, and phone number'));
    }
  }

  next();
});

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
