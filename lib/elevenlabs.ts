interface ElevenLabsConfig {
  apiKey: string;
  baseUrl: string;
}

interface VoiceCloneResponse {
  voice_id: string;
  name: string;
  status: string;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;

  constructor() {
    this.config = {
      apiKey: process.env.ELEVENLABS_API_KEY || '',
      baseUrl: 'https://api.elevenlabs.io/v1',
    };
  }

  async cloneVoice(
    audioFile: File,
    voiceName: string,
    description?: string,
  ): Promise<VoiceCloneResponse> {
    try {
      const formData = new FormData();
      formData.append('files', audioFile);
      formData.append('name', voiceName);
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch(`${this.config.baseUrl}/voices/add`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.config.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error cloning voice with ElevenLabs:', error);
      throw error;
    }
  }

  async getVoices() {
    try {
      const response = await fetch(`${this.config.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching voices from ElevenLabs:', error);
      throw error;
    }
  }

  async deleteVoice(voiceId: string) {
    try {
      const response = await fetch(`${this.config.baseUrl}/voices/${voiceId}`, {
        method: 'DELETE',
        headers: {
          'xi-api-key': this.config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting voice from ElevenLabs:', error);
      throw error;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();
