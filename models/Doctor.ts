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
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [10, 'Phone number must be at least 10 digits'],
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
      enum: {
        values: ['online', 'offline', 'on-leave'],
        message: 'Availability status must be online, offline, or on-leave',
      },
      default: 'offline',
    },
    schedule: {
      type: Map,
      of: [
        {
          start: {
            type: String,
            required: true,
          },
          end: {
            type: String,
            required: true,
          },
          isAvailable: {
            type: Boolean,
            default: true,
          },
        },
      ],
      default: {},
    },
    consultationFee: {
      type: Number,
      min: [0, 'Consultation fee must be non-negative'],
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience must be non-negative'],
    },
    qualifications: {
      type: [String],
      required: [true, 'At least one qualification is required'],
      validate: {
        validator: function (qualifications: string[]) {
          return qualifications.length > 0 && qualifications.every((q) => q.trim() !== '');
        },
        message: 'At least one qualification is required',
      },
    },
    voiceId: {
      type: String,
      trim: true,
    },
    voiceCloneStatus: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'failed'],
        message: 'Voice clone status must be pending, completed, or failed',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
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
DoctorSchema.index({ specialty: 1 });
DoctorSchema.index({ department: 1 });
DoctorSchema.index({ availabilityStatus: 1 });
DoctorSchema.index({ isActive: 1 });
DoctorSchema.index({ createdBy: 1 });
DoctorSchema.index({ createdAt: -1 });

// Compound index for search functionality
DoctorSchema.index({
  name: 'text',
  specialty: 'text',
  department: 'text',
  email: 'text',
});

// Pre-save middleware to validate qualifications
DoctorSchema.pre('save', function (next) {
  const doctor = this as any;

  // Ensure qualifications are not empty
  if (doctor.qualifications && doctor.qualifications.length > 0) {
    doctor.qualifications = doctor.qualifications.filter((q: string) => q.trim() !== '');
    if (doctor.qualifications.length === 0) {
      return next(new Error('At least one qualification is required'));
    }
  }

  next();
});

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
