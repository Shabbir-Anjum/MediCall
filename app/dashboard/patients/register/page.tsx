'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { PatientService } from '@/lib/api/patients';
import { PatientFormData } from '@/types/patient';

export default function RegisterPatientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    email: '',
    mobileNumber: '',
    parentGuardianNumber: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: '',
    },
    medications: [],
    reminderPreferences: {
      sms: true,
      voiceCall: true,
      email: false,
    },
    notes: '',
  });

  const addMedication = () => {
    const newMedication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      times: [''],
      notes: '',
    };
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, newMedication],
    }));
  };

  const removeMedication = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((med) => med.id !== id),
    }));
  };

  const updateMedication = (
    id: string,
    field: keyof (typeof formData.medications)[0],
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med,
      ),
    }));
  };

  const addMedicationTime = (medicationId: string) => {
    updateMedication(medicationId, 'times', [
      ...(formData.medications.find((m) => m.id === medicationId)?.times || []),
      '',
    ]);
  };

  const removeMedicationTime = (medicationId: string, timeIndex: number) => {
    const medication = formData.medications.find((m) => m.id === medicationId);
    if (medication) {
      const newTimes = medication.times.filter((_, index) => index !== timeIndex);
      updateMedication(medicationId, 'times', newTimes);
    }
  };

  const updateMedicationTime = (medicationId: string, timeIndex: number, value: string) => {
    const medication = formData.medications.find((m) => m.id === medicationId);
    if (medication) {
      const newTimes = medication.times.map((time, index) => (index === timeIndex ? value : time));
      updateMedication(medicationId, 'times', newTimes);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name Required', {
        description: "Please enter the patient's full name.",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Email Required', {
        description: "Please enter the patient's email address.",
      });
      return false;
    }

    if (!formData.email.includes('@')) {
      toast.error('Invalid Email', {
        description: 'Please enter a valid email address.',
      });
      return false;
    }

    if (!formData.mobileNumber.trim()) {
      toast.error('Mobile Number Required', {
        description: "Please enter the patient's mobile number.",
      });
      return false;
    }

    if (formData.medications.length === 0) {
      toast.error('Medications Required', {
        description: 'Please add at least one medication.',
      });
      return false;
    }

    // Validate medications
    for (const medication of formData.medications) {
      if (!medication.name.trim()) {
        toast.error('Medication Name Required', {
          description: 'Please enter the name for all medications.',
        });
        return false;
      }

      if (!medication.dosage.trim()) {
        toast.error('Medication Dosage Required', {
          description: 'Please enter the dosage for all medications.',
        });
        return false;
      }

      if (medication.times.length === 0 || medication.times.every((time) => !time.trim())) {
        toast.error('Medication Times Required', {
          description: 'Please enter at least one time for all medications.',
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await PatientService.createPatient(formData);

      toast.success('Patient Registered Successfully! 🎉', {
        description: `${formData.name} has been added to the system.`,
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        mobileNumber: '',
        parentGuardianNumber: '',
        dateOfBirth: '',
        address: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phoneNumber: '',
        },
        medications: [],
        reminderPreferences: {
          sms: true,
          voiceCall: true,
          email: false,
        },
        notes: '',
      });

      // Redirect to patients list
      router.push('/dashboard/patients');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration Failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Register New Patient</h1>
              <p className="text-gray-600 mt-2">Add a new patient to the call center system</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter patient's full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="patient@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobileNumber">Mobile Number *</Label>
                      <Input
                        id="mobileNumber"
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, mobileNumber: e.target.value }))
                        }
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="parentGuardianNumber">Parent/Guardian Number</Label>
                      <Input
                        id="parentGuardianNumber"
                        type="tel"
                        value={formData.parentGuardianNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, parentGuardianNumber: e.target.value }))
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, address: e.target.value }))
                        }
                        placeholder="Enter patient's address"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input
                        id="emergencyName"
                        value={formData.emergencyContact.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            emergencyContact: { ...prev.emergencyContact, name: e.target.value },
                          }))
                        }
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Input
                        id="emergencyRelationship"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            emergencyContact: {
                              ...prev.emergencyContact,
                              relationship: e.target.value,
                            },
                          }))
                        }
                        placeholder="Spouse, Parent, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Phone Number</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={formData.emergencyContact.phoneNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            emergencyContact: {
                              ...prev.emergencyContact,
                              phoneNumber: e.target.value,
                            },
                          }))
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medications */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Medications *</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formData.medications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No medications added yet</p>
                      <p className="text-sm">Click "Add Medication" to get started</p>
                    </div>
                  ) : (
                    formData.medications.map((medication, index) => (
                      <div key={medication.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Medication {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMedication(medication.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Medication Name *</Label>
                            <Input
                              value={medication.name}
                              onChange={(e) =>
                                updateMedication(medication.id, 'name', e.target.value)
                              }
                              placeholder="e.g., Lisinopril"
                              required
                            />
                          </div>
                          <div>
                            <Label>Dosage *</Label>
                            <Input
                              value={medication.dosage}
                              onChange={(e) =>
                                updateMedication(medication.id, 'dosage', e.target.value)
                              }
                              placeholder="e.g., 10mg"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Times to Take *</Label>
                          <div className="space-y-2">
                            {medication.times.map((time, timeIndex) => (
                              <div key={timeIndex} className="flex gap-2">
                                <Input
                                  type="time"
                                  value={time}
                                  onChange={(e) =>
                                    updateMedicationTime(medication.id, timeIndex, e.target.value)
                                  }
                                  required
                                />
                                {medication.times.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMedicationTime(medication.id, timeIndex)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addMedicationTime(medication.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Time
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            value={medication.notes}
                            onChange={(e) =>
                              updateMedication(medication.id, 'notes', e.target.value)
                            }
                            placeholder="Any special instructions or notes..."
                            rows={2}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Reminder Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Reminder Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Reminders</Label>
                      <p className="text-sm text-gray-500">Send text message reminders</p>
                    </div>
                    <Switch
                      checked={formData.reminderPreferences.sms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          reminderPreferences: { ...prev.reminderPreferences, sms: checked },
                        }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Voice Call Reminders</Label>
                      <p className="text-sm text-gray-500">Make automated phone calls</p>
                    </div>
                    <Switch
                      checked={formData.reminderPreferences.voiceCall}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          reminderPreferences: { ...prev.reminderPreferences, voiceCall: checked },
                        }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Reminders</Label>
                      <p className="text-sm text-gray-500">Send email notifications</p>
                    </div>
                    <Switch
                      checked={formData.reminderPreferences.email}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          reminderPreferences: { ...prev.reminderPreferences, email: checked },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes about the patient..."
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/patients')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering Patient...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Register Patient
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
