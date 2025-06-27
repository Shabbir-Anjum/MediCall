'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { doctorService } from '@/lib/api/doctors';
import { DoctorResponse, DoctorFormData } from '@/types/doctor';
import {
  Loader2,
  Edit,
  Save,
  X,
  Trash2,
  Plus,
  Phone,
  Mail,
  Calendar,
  User,
  Award,
  DollarSign,
  Clock,
  Mic,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

type EditingSection = 'personal' | 'professional' | 'schedule' | 'voice' | null;

export default function DoctorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params?.id as string;

  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [formData, setFormData] = useState<DoctorFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!doctorId) return;
    setIsLoading(true);
    doctorService
      .getDoctor(doctorId)
      .then((data) => {
        setDoctor(data);
        setFormData({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          specialty: data.specialty,
          department: data.department,
          licenseNumber: data.licenseNumber,
          bio: data.bio || '',
          avatar: data.avatar || '',
          availabilityStatus: data.availabilityStatus,
          schedule: data.schedule || {},
          consultationFee: data.consultationFee?.toString() || '',
          experience: data.experience.toString(),
          qualifications: data.qualifications,
          isActive: data.isActive,
        });
      })
      .catch((err) => {
        toast.error('Failed to fetch doctor', { description: err.message });
        router.push('/dashboard/doctors');
      })
      .finally(() => setIsLoading(false));
  }, [doctorId, router]);

  const handleEditSection = (section: EditingSection) => {
    setEditingSection(section);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    if (doctor) {
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        specialty: doctor.specialty,
        department: doctor.department,
        licenseNumber: doctor.licenseNumber,
        bio: doctor.bio || '',
        avatar: doctor.avatar || '',
        availabilityStatus: doctor.availabilityStatus,
        schedule: doctor.schedule || {},
        consultationFee: doctor.consultationFee?.toString() || '',
        experience: doctor.experience.toString(),
        qualifications: doctor.qualifications,
        isActive: doctor.isActive,
      });
    }
  };

  const handleSaveSection = async () => {
    if (!formData || !editingSection) return;
    setIsSaving(true);
    try {
      const updateData: any = {};

      switch (editingSection) {
        case 'personal':
          updateData.name = formData.name;
          updateData.email = formData.email;
          updateData.phoneNumber = formData.phoneNumber;
          updateData.bio = formData.bio;
          break;
        case 'professional':
          updateData.specialty = formData.specialty;
          updateData.department = formData.department;
          updateData.licenseNumber = formData.licenseNumber;
          updateData.experience = parseInt(formData.experience);
          updateData.qualifications = formData.qualifications;
          updateData.consultationFee = formData.consultationFee
            ? parseFloat(formData.consultationFee)
            : undefined;
          break;
        case 'schedule':
          updateData.schedule = formData.schedule;
          updateData.availabilityStatus = formData.availabilityStatus;
          break;
        case 'voice':
          // Voice cloning is handled separately
          break;
      }

      const updated = await doctorService.updateDoctor(doctorId, updateData);
      setDoctor(updated);
      setEditingSection(null);
      toast.success('Doctor updated successfully');
    } catch (err: any) {
      toast.error('Failed to update doctor', { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      await doctorService.deleteDoctor(doctorId);
      toast.success('Doctor deleted successfully');
      router.push('/dashboard/doctors');
    } catch (err: any) {
      toast.error('Failed to delete doctor', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      case 'on-leave':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVoiceStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const addQualification = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, ''],
    });
  };

  const removeQualification = (index: number) => {
    if (!formData) return;
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter((_, i) => i !== index),
    });
  };

  const updateQualification = (index: number, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      qualifications: formData.qualifications.map((q, i) => (i === index ? value : q)),
    });
  };

  if (isLoading || !formData || !doctor) {
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
      className="max-w-4xl mx-auto py-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={doctor.avatar} alt={doctor.name} />
            <AvatarFallback className="text-lg">
              {doctor.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
            <p className="text-gray-600">
              {doctor.specialty} • {doctor.department}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(doctor.availabilityStatus)}>
                {doctor.availabilityStatus === 'online'
                  ? 'Available'
                  : doctor.availabilityStatus === 'offline'
                    ? 'Offline'
                    : 'On Leave'}
              </Badge>
              {doctor.voiceCloneStatus && (
                <Badge className={getVoiceStatusColor(doctor.voiceCloneStatus)}>
                  Voice {doctor.voiceCloneStatus}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/doctors')}>
            Back to Doctors
          </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              {editingSection !== 'personal' && (
                <Button variant="outline" size="sm" onClick={() => handleEditSection('personal')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingSection === 'personal' ? (
              <>
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => prev && { ...prev, name: e.target.value })
                    }
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => prev && { ...prev, phoneNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => prev && { ...prev, bio: e.target.value })
                    }
                    rows={3}
                    placeholder="Tell us about the doctor..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveSection} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{doctor.phoneNumber}</span>
                </div>
                {doctor.bio ? (
                  <div>
                    <Label className="text-sm font-medium">Bio</Label>
                    <p className="text-gray-600 mt-1">{doctor.bio}</p>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No bio provided</div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Professional Information
              </CardTitle>
              {editingSection !== 'professional' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSection('professional')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingSection === 'professional' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Input
                      id="specialty"
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData((prev) => prev && { ...prev, specialty: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData((prev) => prev && { ...prev, department: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="licenseNumber">License Number *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData((prev) => prev && { ...prev, licenseNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData((prev) => prev && { ...prev, experience: e.target.value })
                      }
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                    <Input
                      id="consultationFee"
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) =>
                        setFormData((prev) => prev && { ...prev, consultationFee: e.target.value })
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <Label>Qualifications</Label>
                  <div className="space-y-2">
                    {formData.qualifications.map((qual, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={qual}
                          onChange={(e) => updateQualification(index, e.target.value)}
                          placeholder="e.g., MD, PhD, Board Certified"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQualification(index)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addQualification}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Qualification
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveSection} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Specialty</Label>
                    <p className="text-gray-600">{doctor.specialty}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Department</Label>
                    <p className="text-gray-600">{doctor.department}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">License Number</Label>
                  <p className="text-gray-600">{doctor.licenseNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Experience</Label>
                    <p className="text-gray-600">{doctor.experience} years</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Consultation Fee</Label>
                    <p className="text-gray-600">
                      {doctor.consultationFee ? `$${doctor.consultationFee}` : 'Not set'}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Qualifications</Label>
                  {doctor.qualifications.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doctor.qualifications.map((qual, index) => (
                        <Badge key={index} variant="secondary">
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No qualifications listed</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Schedule & Availability */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule & Availability
              </CardTitle>
              {editingSection !== 'schedule' && (
                <Button variant="outline" size="sm" onClick={() => handleEditSection('schedule')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingSection === 'schedule' ? (
              <>
                <div>
                  <Label htmlFor="availabilityStatus">Availability Status</Label>
                  <select
                    id="availabilityStatus"
                    value={formData.availabilityStatus}
                    onChange={(e) =>
                      setFormData(
                        (prev) =>
                          prev && {
                            ...prev,
                            availabilityStatus: e.target.value as 'online' | 'offline' | 'on-leave',
                          },
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <Label>Schedule</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    Schedule management will be implemented in a future update
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveSection} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-sm font-medium">Current Status</Label>
                  <Badge className={`mt-1 ${getStatusColor(doctor.availabilityStatus)}`}>
                    {doctor.availabilityStatus === 'online'
                      ? 'Available'
                      : doctor.availabilityStatus === 'offline'
                        ? 'Offline'
                        : 'On Leave'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Schedule</Label>
                  <p className="text-gray-500 italic">Schedule not configured</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Voice Clone Status */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Clone Status
              </CardTitle>
              {editingSection !== 'voice' && doctor.voiceCloneStatus !== 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/doctors/${doctorId}/voice-clone`)}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Clone Voice
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Voice Clone Status</Label>
              {doctor.voiceCloneStatus ? (
                <div className="flex items-center gap-2 mt-1">
                  {doctor.voiceCloneStatus === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {doctor.voiceCloneStatus === 'pending' && (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  {doctor.voiceCloneStatus === 'failed' && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <Badge className={getVoiceStatusColor(doctor.voiceCloneStatus)}>
                    {doctor.voiceCloneStatus.charAt(0).toUpperCase() +
                      doctor.voiceCloneStatus.slice(1)}
                  </Badge>
                </div>
              ) : (
                <p className="text-gray-500 italic">No voice clone created</p>
              )}
            </div>
            {doctor.voiceId && (
              <div>
                <Label className="text-sm font-medium">Voice ID</Label>
                <p className="text-gray-600 font-mono text-sm">{doctor.voiceId}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
