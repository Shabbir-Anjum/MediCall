interface BlandAiConfig {
  apiKey: string;
  baseUrl: string;
}

class BlandAiService {
  private config: BlandAiConfig;

  constructor() {
    this.config = {
      apiKey: process.env.BLANDAI_API_KEY || '',
      baseUrl: 'https://api.bland.ai/v1',
    };
  }

  async makeCall(phoneNumber: string, script: string, patientName: string) {
    try {
      const response = await fetch(`${this.config.baseUrl}/calls`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          task: script,
          voice: 'nat',
          reduce_latency: true,
          webhook: `${process.env.NEXTAUTH_URL}/api/bland-ai/webhook`,
          metadata: {
            patient_name: patientName,
            call_type: 'reminder',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Bland AI API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error making call with Bland AI:', error);
      throw error;
    }
  }

  async sendSMS(phoneNumber: string, message: string) {
    try {
      const response = await fetch(`${this.config.baseUrl}/sms`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Bland AI SMS API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending SMS with Bland AI:', error);
      throw error;
    }
  }

  generateMedicationReminderScript(
    patientName: string,
    medicationName: string,
    dosage: string,
    time: string,
  ) {
    return `Hello ${patientName}, this is a friendly reminder from your healthcare provider. 
    It's time to take your ${medicationName} medication, ${dosage}. 
    The current time is ${time}. 
    Please take your medication as prescribed by your doctor. 
    If you have any questions or concerns, please contact your healthcare provider. 
    If this is an emergency, please hang up and dial 911 immediately. 
    Thank you and have a great day!`;
  }

  generateAppointmentReminderScript(
    patientName: string,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string,
  ) {
    return `Hello ${patientName}, this is a reminder about your upcoming appointment with Dr. ${doctorName} 
    scheduled for ${appointmentDate} at ${appointmentTime}. 
    Please make sure to arrive 15 minutes early and bring your insurance card and ID. 
    If you need to reschedule or cancel, please call our office as soon as possible. 
    If this is an emergency, please hang up and dial 911 immediately. 
    Thank you!`;
  }
}

export const blandAiService = new BlandAiService();
