import {
  PatientResponse,
  PatientsListResponse,
  CreatePatientResponse,
  ApiError,
  PatientFormData,
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
    // Transform form data to API format
    const apiData = {
      name: data.name,
      email: data.email,
      mobileNumber: data.mobileNumber,
      parentGuardianNumber: data.parentGuardianNumber || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      address: data.address || undefined,
      emergencyContact: data.emergencyContact.name
        ? {
            name: data.emergencyContact.name,
            relationship: data.emergencyContact.relationship,
            phoneNumber: data.emergencyContact.phoneNumber,
          }
        : undefined,
      medications: data.medications.map((med) => ({
        name: med.name,
        dosage: med.dosage,
        times: med.times.filter((time) => time.trim() !== ''),
        notes: med.notes || undefined,
      })),
      reminderPreferences: data.reminderPreferences,
      notes: data.notes || undefined,
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
