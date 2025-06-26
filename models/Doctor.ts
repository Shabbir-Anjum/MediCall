import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  department: string;
  licenseNumber: string;
  bio?: string;
  avatar?: string;
  availabilityStatus: 'online' | 'offline' | 'on-leave';
  schedule: {
    [key: string]: {
      start: string;
      end: string;
      isAvailable: boolean;
    }[];
  };
  consultationFee?: number;
  experience: number;
  qualifications: string[];
  voiceId?: string; // ElevenLabs voice ID
  voiceCloneStatus?: 'pending' | 'completed' | 'failed';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    availabilityStatus: {
      type: String,
      enum: ['online', 'offline', 'on-leave'],
      default: 'offline',
    },
    schedule: {
      type: Map,
      of: [
        {
          start: String,
          end: String,
          isAvailable: Boolean,
        },
      ],
      default: {},
    },
    consultationFee: {
      type: Number,
      min: 0,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    qualifications: [
      {
        type: String,
        trim: true,
      },
    ],
    voiceId: {
      type: String,
      trim: true,
    },
    voiceCloneStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
