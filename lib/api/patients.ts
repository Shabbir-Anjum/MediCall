import {
  PatientResponse,
  PatientsListResponse,
  CreatePatientResponse,
  ApiError,
  PatientFormData,
  FormPatientSchema,
} from '@/types/patient';

const API_BASE_URL = '/api/patients';

export class PatientService {
  static async getPatients(params?: {
    status?: string;
    search?: string;
  }): Promise<PatientsListResponse> {
    const url = new URL(API_BASE_URL, window.location.origin);

    if (params?.status) {
      url.searchParams.set('status', params.status);
    }

    if (params?.search) {
      url.searchParams.set('search', params.search);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to fetch patients');
    }

    return response.json();
  }

  static async createPatient(data: PatientFormData): Promise<CreatePatientResponse> {
    // First validate the form data
    const validationResult = FormPatientSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(
        `Validation failed: ${validationResult.error.errors.map((e) => e.message).join(', ')}`,
      );
    }

    // Transform form data to API format
    const apiData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      mobileNumber: data.mobileNumber.trim(),
      parentGuardianNumber: data.parentGuardianNumber?.trim() || undefined,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      address: data.address?.trim() || undefined,
      emergencyContact:
        data.emergencyContact.name &&
        data.emergencyContact.relationship &&
        data.emergencyContact.phoneNumber
          ? {
              name: data.emergencyContact.name.trim(),
              relationship: data.emergencyContact.relationship.trim(),
              phoneNumber: data.emergencyContact.phoneNumber.trim(),
            }
          : undefined,
      medications: data.medications.map((med) => ({
        name: med.name.trim(),
        dosage: med.dosage.trim(),
        times: med.times.filter((time) => time.trim() !== ''),
        notes: med.notes?.trim() || undefined,
        isActive: true,
      })),
      reminderPreferences: data.reminderPreferences,
      notes: data.notes?.trim() || undefined,
    };

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to create patient');
    }

    return response.json();
  }

  static async updatePatient(id: string, data: Partial<PatientFormData>): Promise<PatientResponse> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to update patient');
    }

    return response.json();
  }

  static async deletePatient(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to delete patient');
    }
  }

  static async getPatient(id: string): Promise<PatientResponse> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to fetch patient');
    }

    return response.json();
  }

  static async updatePatientStatus(
    id: string,
    status: 'active' | 'paused' | 'completed',
  ): Promise<PatientResponse> {
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to update patient status');
    }

    return response.json();
  }
}
