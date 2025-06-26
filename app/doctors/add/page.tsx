'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Save, Upload, Clock, Plus, Trash2 } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface DoctorFormData {
  name: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  department: string;
  licenseNumber: string;
  bio: string;
  experience: number;
  consultationFee: number;
  qualifications: string[];
  availabilitySlots: AvailabilitySlot[];
  profileImage?: File;
}

const specialties = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Psychiatry',
  'Oncology',
  'Gastroenterology',
  'Endocrinology',
  'Pulmonology',
  'Nephrology',
  'Rheumatology',
  'General Medicine',
  'Surgery',
  'Emergency Medicine',
];

const departments = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Psychiatry',
  'Oncology',
  'Gastroenterology',
  'Endocrinology',
  'Pulmonology',
  'Nephrology',
  'Rheumatology',
  'General Medicine',
  'Surgery',
  'Emergency',
  'ICU',
  'Radiology',
  'Laboratory',
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AddDoctorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<DoctorFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    specialty: '',
    department: '',
    licenseNumber: '',
    bio: '',
    experience: 0,
    consultationFee: 0,
    qualifications: [''],
    availabilitySlots: [],
  });

  const [user] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@medicall.com',
    role: 'senior agent',
    avatar:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
  });

  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, ''],
    }));
  };

  const removeQualification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  const updateQualification = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.map((qual, i) => (i === index ? value : qual)),
    }));
  };

  const addAvailabilitySlot = () => {
    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      day: '',
      startTime: '',
      endTime: '',
    };
    setFormData((prev) => ({
      ...prev,
      availabilitySlots: [...prev.availabilitySlots, newSlot],
    }));
  };

  const removeAvailabilitySlot = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.filter((slot) => slot.id !== id),
    }));
  };

  const updateAvailabilitySlot = (id: string, field: keyof AvailabilitySlot, value: string) => {
    setFormData((prev) => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot,
      ),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: 'Doctor Added Successfully',
        description: `Dr. ${formData.name} has been added to the system.`,
      });

      router.push('/doctors');
    } catch (error) {
      toast({
        title: 'Failed to Add Doctor',
        description: 'There was an error adding the doctor. Please try again.',
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
              <h1 className="text-3xl font-bold text-gray-900">Add New Doctor</h1>
              <p className="text-gray-600 mt-2">Add a new doctor to the hospital system</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Dr. John Smith"
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
                        placeholder="doctor@hospital.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
                        }
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="license">License Number *</Label>
                      <Input
                        id="license"
                        value={formData.licenseNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, licenseNumber: e.target.value }))
                        }
                        placeholder="MD123456"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specialty">Specialty *</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, specialty: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, department: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem key={department} value={department}>
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            experience: parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fee">Consultation Fee ($)</Label>
                      <Input
                        id="fee"
                        type="number"
                        min="0"
                        value={formData.consultationFee}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            consultationFee: parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Brief description about the doctor..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Profile Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="image">Upload Profile Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Recommended: Square image, at least 300x300px
                      </p>
                    </div>
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Qualifications */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Qualifications</CardTitle>
                  <Button type="button" onClick={addQualification} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Qualification
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.qualifications.map((qualification, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={qualification}
                        onChange={(e) => updateQualification(index, e.target.value)}
                        placeholder="e.g., MD from Harvard Medical School"
                        className="flex-1"
                      />
                      {formData.qualifications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQualification(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Availability Schedule */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Availability Schedule
                  </CardTitle>
                  <Button type="button" onClick={addAvailabilitySlot} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.availabilitySlots.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No availability slots added yet.</p>
                      <p className="text-sm">Click "Add Time Slot" to get started.</p>
                    </div>
                  ) : (
                    formData.availabilitySlots.map((slot) => (
                      <div key={slot.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Time Slot</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAvailabilitySlot(slot.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Day</Label>
                            <Select
                              onValueChange={(value) =>
                                updateAvailabilitySlot(slot.id, 'day', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select day" />
                              </SelectTrigger>
                              <SelectContent>
                                {daysOfWeek.map((day) => (
                                  <SelectItem key={day} value={day}>
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateAvailabilitySlot(slot.id, 'startTime', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateAvailabilitySlot(slot.id, 'endTime', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/doctors')}
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
                      Adding Doctor...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Add Doctor
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
