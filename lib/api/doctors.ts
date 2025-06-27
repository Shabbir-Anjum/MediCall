import {
  DoctorResponse,
  CreateDoctorData,
  UpdateDoctorData,
  DoctorsListResponse,
  VoiceCloneRequest,
  VoiceCloneResponse,
} from '@/types/doctor';

class DoctorService {
  private baseUrl = '/api/doctors';

  // Get all doctors with optional filters
  async getDoctors(params?: {
    search?: string;
    specialty?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<DoctorsListResponse> {
    const url = new URL(this.baseUrl, window.location.origin);

    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.specialty) url.searchParams.set('specialty', params.specialty);
    if (params?.status) url.searchParams.set('status', params.status);
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.limit) url.searchParams.set('limit', params.limit.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch doctors');
    }

    return response.json();
  }

  // Get a single doctor by ID
  async getDoctor(id: string): Promise<DoctorResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch doctor');
    }

    return response.json();
  }

  // Create a new doctor
  async createDoctor(data: CreateDoctorData): Promise<DoctorResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create doctor');
    }

    return response.json();
  }

  // Update a doctor
  async updateDoctor(id: string, data: UpdateDoctorData): Promise<DoctorResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update doctor');
    }

    return response.json();
  }

  // Delete a doctor
  async deleteDoctor(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete doctor');
    }
  }

  // Update doctor status
  async updateDoctorStatus(
    id: string,
    status: 'online' | 'offline' | 'on-leave',
  ): Promise<DoctorResponse> {
    const response = await fetch(`${this.baseUrl}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ availabilityStatus: status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update doctor status');
    }

    return response.json();
  }

  // Clone doctor's voice
  async cloneVoice(data: VoiceCloneRequest): Promise<VoiceCloneResponse> {
    const formData = new FormData();
    formData.append('audioFile', data.audioFile);

    const response = await fetch(`${this.baseUrl}/${data.doctorId}/voice-clone`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to clone voice');
    }

    return response.json();
  }

  // Get voice clone status
  async getVoiceCloneStatus(doctorId: string): Promise<VoiceCloneResponse> {
    const response = await fetch(`${this.baseUrl}/${doctorId}/voice-clone`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get voice clone status');
    }

    return response.json();
  }

  // Upload doctor avatar
  async uploadAvatar(doctorId: string, file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${this.baseUrl}/${doctorId}/avatar`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload avatar');
    }

    return response.json();
  }
}

export const doctorService = new DoctorService();
