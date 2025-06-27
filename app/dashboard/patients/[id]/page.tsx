'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { PatientService } from '@/lib/api/patients';
import { PatientResponse, PatientFormData } from '@/types/patient';
import { Loader2, Edit, Save, X, Trash2, Plus } from 'lucide-react';

type MedicationField = keyof PatientFormData['medications'][0];

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PatientFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    setIsLoading(true);
    PatientService.getPatient(patientId)
      .then((data) => {
        setPatient(data);
        setFormData({
          name: data.name,
          email: data.email,
          mobileNumber: data.mobileNumber,
          parentGuardianNumber: data.parentGuardianNumber || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
          address: data.address || '',
          emergencyContact: data.emergencyContact || {
            name: '',
            relationship: '',
            phoneNumber: '',
          },
          medications: data.medications.map((m, i) => ({
            id: String(i),
            name: m.name,
            dosage: m.dosage,
            times: m.times,
            notes: m.notes || '',
          })),
          reminderPreferences: data.reminderPreferences,
          notes: data.notes || '',
        });
      })
      .catch((err) => {
        toast.error('Failed to fetch patient', { description: err.message });
        router.push('/dashboard/patients');
      })
      .finally(() => setIsLoading(false));
  }, [patientId, router]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    if (patient) {
      setFormData({
        name: patient.name,
        email: patient.email,
        mobileNumber: patient.mobileNumber,
        parentGuardianNumber: patient.parentGuardianNumber || '',
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.slice(0, 10) : '',
        address: patient.address || '',
        emergencyContact: patient.emergencyContact || {
          name: '',
          relationship: '',
          phoneNumber: '',
        },
        medications: patient.medications.map((m, i) => ({
          id: String(i),
          name: m.name,
          dosage: m.dosage,
          times: m.times,
          notes: m.notes || '',
        })),
        reminderPreferences: patient.reminderPreferences,
        notes: patient.notes || '',
      });
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const updated = await PatientService.updatePatient(patientId, formData);
      setPatient(updated);
      setIsEditing(false);
      toast.success('Patient updated successfully');
    } catch (err: any) {
      toast.error('Failed to update patient', { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')
    )
      return;
    setIsDeleting(true);
    try {
      await PatientService.deletePatient(patientId);
      toast.success('Patient deleted');
      router.push('/dashboard/patients');
    } catch (err: any) {
      toast.error('Failed to delete patient', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  // Medication helpers
  const addMedication = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { id: Date.now().toString(), name: '', dosage: '', times: [''], notes: '' },
      ],
    });
  };
  const removeMedication = (id: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      medications: formData.medications.filter((m) => m.id !== id),
    });
  };
  const updateMedication = (id: string, field: MedicationField, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      medications: formData.medications.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  };
  const addMedicationTime = (medicationId: string) => {
    if (!formData) return;
    const med = formData.medications.find((m) => m.id === medicationId);
    if (!med) return;
    updateMedication(medicationId, 'times', [...med.times, '']);
  };
  const removeMedicationTime = (medicationId: string, timeIndex: number) => {
    if (!formData) return;
    const med = formData.medications.find((m) => m.id === medicationId);
    if (!med) return;
    updateMedication(
      medicationId,
      'times',
      med.times.filter((_, i) => i !== timeIndex),
    );
  };
  const updateMedicationTime = (medicationId: string, timeIndex: number, value: string) => {
    if (!formData) return;
    const med = formData.medications.find((m) => m.id === medicationId);
    if (!med) return;
    updateMedication(
      medicationId,
      'times',
      med.times.map((t, i) => (i === timeIndex ? value : t)),
    );
  };

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto py-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
        <div className="flex gap-2">
          {!isEditing && (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
          {isEditing && (
            <>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </>
          )}
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        {/* Patient Info */}
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
                  onChange={(e) => setFormData((prev) => prev && { ...prev, name: e.target.value })}
                  disabled={!isEditing}
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
                    setFormData((prev) => prev && { ...prev, email: e.target.value })
                  }
                  disabled={!isEditing}
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
                    setFormData((prev) => prev && { ...prev, mobileNumber: e.target.value })
                  }
                  disabled={!isEditing}
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
                    setFormData((prev) => prev && { ...prev, parentGuardianNumber: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData((prev) => prev && { ...prev, dateOfBirth: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => prev && { ...prev, address: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    setFormData(
                      (prev) =>
                        prev && {
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, name: e.target.value },
                        },
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Input
                  id="emergencyRelationship"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) =>
                    setFormData(
                      (prev) =>
                        prev && {
                          ...prev,
                          emergencyContact: {
                            ...prev.emergencyContact,
                            relationship: e.target.value,
                          },
                        },
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyContact.phoneNumber}
                  onChange={(e) =>
                    setFormData(
                      (prev) =>
                        prev && {
                          ...prev,
                          emergencyContact: {
                            ...prev.emergencyContact,
                            phoneNumber: e.target.value,
                          },
                        },
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Medications */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Medications</CardTitle>
              {isEditing && (
                <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                  <Plus className="h-4 w-4 mr-2" /> Add Medication
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.medications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No medications added</div>
            ) : (
              formData.medications.map((medication, index) => (
                <div key={medication.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Medication {index + 1}</h4>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(medication.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Medication Name *</Label>
                      <Input
                        value={medication.name}
                        onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                        placeholder="e.g., Lisinopril"
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Dosage *</Label>
                      <Input
                        value={medication.dosage}
                        onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                        placeholder="e.g., 10mg"
                        required
                        disabled={!isEditing}
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
                            disabled={!isEditing}
                          />
                          {isEditing && medication.times.length > 1 && (
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
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addMedicationTime(medication.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Time
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={medication.notes}
                      onChange={(e) => updateMedication(medication.id, 'notes', e.target.value)}
                      placeholder="Any special instructions or notes..."
                      rows={2}
                      disabled={!isEditing}
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
                  setFormData(
                    (prev) =>
                      prev && {
                        ...prev,
                        reminderPreferences: { ...prev.reminderPreferences, sms: checked },
                      },
                  )
                }
                disabled={!isEditing}
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
                  setFormData(
                    (prev) =>
                      prev && {
                        ...prev,
                        reminderPreferences: { ...prev.reminderPreferences, voiceCall: checked },
                      },
                  )
                }
                disabled={!isEditing}
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
                  setFormData(
                    (prev) =>
                      prev && {
                        ...prev,
                        reminderPreferences: { ...prev.reminderPreferences, email: checked },
                      },
                  )
                }
                disabled={!isEditing}
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
              onChange={(e) => setFormData((prev) => prev && { ...prev, notes: e.target.value })}
              placeholder="Any additional notes about the patient..."
              rows={4}
              disabled={!isEditing}
            />
          </CardContent>
        </Card>
      </form>
    </motion.div>
  );
}
