import { z } from 'zod';

// Zod schemas for validation
export const MedicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  times: z.array(z.string()).min(1, 'At least one time is required'),
  notes: z.string().optional(),
  prescribingDoctor: z.string().optional(),
  pharmacy: z.string().optional(),
  prescriptionNumber: z.string().optional(),
  refillDate: z.date().optional(),
  sideEffects: z.array(z.string()).optional(),
  drugInteractions: z.array(z.string()).optional(),
  instructions: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const EmergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

export const InsuranceInfoSchema = z.object({
  provider: z.string().min(1, 'Insurance provider is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  groupNumber: z.string().optional(),
});

export const PrimaryCarePhysicianSchema = z.object({
  name: z.string().min(1, 'Physician name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email').optional(),
});

export const ReminderPreferencesSchema = z.object({
  sms: z.boolean(),
  voiceCall: z.boolean(),
  email: z.boolean(),
});

export const PatientSchema = z.object({
  name: z.string().min(1, 'Patient name is required'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(10, 'Valid mobile number is required'),
  parentGuardianNumber: z.string().optional(),
  dateOfBirth: z.date().optional(),
  address: z.string().optional(),
  emergencyContact: EmergencyContactSchema.optional(),
  medications: z.array(MedicationSchema),
  reminderPreferences: ReminderPreferencesSchema,
  status: z.enum(['active', 'paused', 'completed']).default('active'),
  avatar: z.string().optional(),
  notes: z.string().optional(),
  prescriptionImages: z.array(z.string()).optional(),
  lastReminderSent: z.date().optional(),
  nextReminderDue: z.date().optional(),
  allergies: z.array(z.string()).optional(),
  medicalHistory: z.string().optional(),
  insuranceInfo: InsuranceInfoSchema.optional(),
  primaryCarePhysician: PrimaryCarePhysicianSchema.optional(),
});

// TypeScript types
export type Medication = z.infer<typeof MedicationSchema>;
export type EmergencyContact = z.infer<typeof EmergencyContactSchema>;
export type InsuranceInfo = z.infer<typeof InsuranceInfoSchema>;
export type PrimaryCarePhysician = z.infer<typeof PrimaryCarePhysicianSchema>;
export type ReminderPreferences = z.infer<typeof ReminderPreferencesSchema>;
export type Patient = z.infer<typeof PatientSchema>;
export type CreatePatientData = z.infer<typeof PatientSchema>;

// API Response types
export interface PatientResponse {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  parentGuardianNumber?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  medications: Medication[];
  reminderPreferences: ReminderPreferences;
  status: 'active' | 'paused' | 'completed';
  avatar?: string;
  notes?: string;
  prescriptionImages: string[];
  lastReminderSent?: string;
  nextReminderDue?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PatientsListResponse {
  patients: PatientResponse[];
}

export interface CreatePatientResponse {
  patient: PatientResponse;
}

export interface ApiError {
  error: string;
}

// UI Component types
export interface PatientCardProps {
  patient: PatientResponse;
  onEdit: (patient: PatientResponse) => void;
  onView: (patient: PatientResponse) => void;
  onStatusChange: (patientId: string, status: 'active' | 'paused' | 'completed') => void;
}

export interface PatientFormData {
  name: string;
  email: string;
  mobileNumber: string;
  parentGuardianNumber: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    times: string[];
    notes: string;
  }>;
  reminderPreferences: {
    sms: boolean;
    voiceCall: boolean;
    email: boolean;
  };
  notes: string;
}
