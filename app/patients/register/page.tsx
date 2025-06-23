'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Clock } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  notes: string;
}

interface PatientFormData {
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
  medications: Medication[];
  reminderPreferences: {
    sms: boolean;
    voiceCall: boolean;
    email: boolean;
  };
  notes: string;
}

export default function RegisterPatientPage() {
  const router = useRouter();
  const { toast } = useToast();
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

  const [user] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@medicall.com',
    role: 'senior agent',
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
  });

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      times: [''],
      notes: '',
    };
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, newMedication],
    }));
  };

  const removeMedication = (id: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== id),
    }));
  };

  const updateMedication = (id: string, field: keyof Medication, value: any) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map(med =>
        med.id === id ? { ...med, [field]: value } : med
      ),
    }));
  };

  const addMedicationTime = (medicationId: string) => {
    updateMedication(medicationId, 'times', [
      ...formData.medications.find(m => m.id === medicationId)?.times || [],
      '',
    ]);
  };

  const removeMedicationTime = (medicationId: string, timeIndex: number) => {
    const medication = formData.medications.find(m => m.id === medicationId);
    if (medication) {
      const newTimes = medication.times.filter((_, index) => index !== timeIndex);
      updateMedication(medicationId, 'times', newTimes);
    }
  };

  const updateMedicationTime = (medicationId: string, timeIndex: number, value: string) => {
    const medication = formData.medications.find(m => m.id === medicationId);
    if (medication) {
      const newTimes = medication.times.map((time, index) =>
        index === timeIndex ? value : time
      );
      updateMedication(medicationId, 'times', newTimes);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Patient Registered Successfully',
        description: `${formData.name} has been added to the system.`,
      });
      
      router.push('/patients');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'There was an error registering the patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        
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
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="patient@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="guardian">Parent/Guardian Number</Label>
                      <Input
                        id="guardian"
                        value={formData.parentGuardianNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, parentGuardianNumber: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="123 Main St, City, State 12345"
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
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                        }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                        }))}
                        placeholder="Spouse, Parent, Sibling"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Phone Number</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyContact.phoneNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, phoneNumber: e.target.value }
                        }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medication Schedule */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Medication Schedule</CardTitle>
                  <Button type="button" onClick={addMedication} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formData.medications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No medications added yet.</p>
                      <p className="text-sm">Click "Add Medication" to get started.</p>
                    </div>
                  ) : (
                    formData.medications.map((medication, index) => (
                      <motion.div
                        key={medication.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border border-gray-200 rounded-lg space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
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
                            <Label>Medicine Name *</Label>
                            <Input
                              value={medication.name}
                              onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                              placeholder="e.g., Metformin"
                              required
                            />
                          </div>
                          <div>
                            <Label>Dosage *</Label>
                            <Input
                              value={medication.dosage}
                              onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                              placeholder="e.g., 500mg"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2" />
                            Time(s) to Take
                          </Label>
                          <div className="space-y-2">
                            {medication.times.map((time, timeIndex) => (
                              <div key={timeIndex} className="flex items-center space-x-2">
                                <Input
                                  type="time"
                                  value={time}
                                  onChange={(e) => updateMedicationTime(medication.id, timeIndex, e.target.value)}
                                  className="flex-1"
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
                            onChange={(e) => updateMedication(medication.id, 'notes', e.target.value)}
                            placeholder="Special instructions or notes"
                            className="resize-none"
                          />
                        </div>
                      </motion.div>
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Reminders</Label>
                        <p className="text-sm text-gray-500">Send text message reminders</p>
                      </div>
                      <Switch
                        checked={formData.reminderPreferences.sms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({
                            ...prev,
                            reminderPreferences: { ...prev.reminderPreferences, sms: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Voice Call Reminders</Label>
                        <p className="text-sm text-gray-500">Automated voice call reminders</p>
                      </div>
                      <Switch
                        checked={formData.reminderPreferences.voiceCall}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({
                            ...prev,
                            reminderPreferences: { ...prev.reminderPreferences, voiceCall: checked }
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
                          setFormData(prev => ({
                            ...prev,
                            reminderPreferences: { ...prev.reminderPreferences, email: checked }
                          }))
                        }
                      />
                    </div>
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
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special instructions, allergies, or important information..."
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push('/patients')}
                  disabled={isLoading}
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
                      <Save className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
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