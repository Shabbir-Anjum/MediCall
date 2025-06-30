import { z } from 'zod';

export const ScheduleTimeSlotSchema = z.object({
  start: z.string().min(1, 'Start time is required'),
  end: z.string().min(1, 'End time is required'),
  isAvailable: z.boolean().default(true),
});

export const ScheduleSchema = z.record(z.array(ScheduleTimeSlotSchema));

// API Doctor Schema (for database)
export const DoctorSchema = z.object({
  name: z.string().min(1, 'Doctor name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  department: z.string().min(1, 'Department is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  availabilityStatus: z.enum(['online', 'offline', 'on-leave']).default('offline'),
  schedule: ScheduleSchema.optional(),
  consultationFee: z.number().min(0, 'Consultation fee must be non-negative').optional(),
  experience: z.number().min(0, 'Experience must be non-negative'),
  qualifications: z.array(z.string()).min(1, 'At least one qualification is required'),
  voiceId: z.string().optional(),
  voiceCloneStatus: z.enum(['pending', 'completed', 'failed']).optional(),
  isActive: z.boolean().default(true),
});

// Form Doctor Schema (for form validation)
export const FormDoctorSchema = z.object({
  name: z.string().min(1, 'Doctor name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  department: z.string().min(1, 'Department is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  bio: z.string().optional(),
  experience: z.string().min(1, 'Experience is required'), // String for form input
  consultationFee: z.string().optional(), // String for form input
  qualifications: z.array(z.string()).min(1, 'At least one qualification is required'),
  availabilitySlots: z
    .array(
      z.object({
        id: z.string(),
        day: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .optional(),
});

export const CreateDoctorSchema = DoctorSchema.omit({
  voiceId: true,
  voiceCloneStatus: true,
  isActive: true,
});

export const UpdateDoctorSchema = DoctorSchema.partial();

// TypeScript types
export type Doctor = z.infer<typeof DoctorSchema>;
export type FormDoctor = z.infer<typeof FormDoctorSchema>;
export type CreateDoctorData = z.infer<typeof CreateDoctorSchema>;
export type UpdateDoctorData = z.infer<typeof UpdateDoctorSchema>;
export type ScheduleTimeSlot = z.infer<typeof ScheduleTimeSlotSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;

// API Response types
export interface DoctorResponse extends Doctor {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorsListResponse {
  doctors: DoctorResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form data types for frontend
export interface DoctorFormData {
  name: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  department: string;
  licenseNumber: string;
  bio: string;
  avatar: string;
  availabilityStatus: 'online' | 'offline' | 'on-leave';
  schedule: Schedule;
  consultationFee: string;
  experience: string;
  qualifications: string[];
  isActive: boolean;
}

// Voice clone types
export interface VoiceCloneRequest {
  doctorId: string;
  audioFile: File;
}

export interface VoiceCloneResponse {
  voiceId: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}
