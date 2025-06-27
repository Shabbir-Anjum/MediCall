'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Eye, Edit, Calendar, Phone, Mail, Mic } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import VoiceCloneModal from '@/components/doctors/VoiceCloneModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  department: string;
  availabilityStatus: 'online' | 'offline' | 'on-leave';
  avatar?: string;
  experience: number;
  consultationFee?: number;
  voiceId?: string;
  voiceCloneStatus?: 'pending' | 'completed' | 'failed';
}

export default function DoctorsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [voiceCloneModal, setVoiceCloneModal] = useState<{
    isOpen: boolean;
    doctorId: string;
    doctorName: string;
  }>({
    isOpen: false,
    doctorId: '',
    doctorName: '',
  });

  const [user] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@medicall.com',
    role: 'senior agent',
    avatar:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
  });

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        const data = await response.json();

        if (response.ok) {
          setDoctors(data.doctors || []);
        } else {
          throw new Error(data.error || 'Failed to fetch doctors');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: 'Error',
          description: 'Failed to load doctors. Using sample data.',
          variant: 'destructive',
        });

        // Fallback to mock data
        const mockDoctors: Doctor[] = [
          {
            _id: '1',
            name: 'Dr. Emily Wilson',
            email: 'emily.wilson@hospital.com',
            phoneNumber: '+1 (555) 111-2222',
            specialty: 'Cardiology',
            department: 'Cardiology',
            availabilityStatus: 'online',
            avatar:
              'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150',
            experience: 12,
            consultationFee: 200,
          },
          {
            _id: '2',
            name: 'Dr. Michael Chen',
            email: 'michael.chen@hospital.com',
            phoneNumber: '+1 (555) 222-3333',
            specialty: 'Neurology',
            department: 'Neurology',
            availabilityStatus: 'online',
            avatar:
              'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=150',
            experience: 8,
            consultationFee: 250,
          },
          {
            _id: '3',
            name: 'Dr. Sarah Davis',
            email: 'sarah.davis@hospital.com',
            phoneNumber: '+1 (555) 333-4444',
            specialty: 'Pediatrics',
            department: 'Pediatrics',
            availabilityStatus: 'offline',
            avatar:
              'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150',
            experience: 15,
            consultationFee: 180,
          },
          {
            _id: '4',
            name: 'Dr. James Rodriguez',
            email: 'james.rodriguez@hospital.com',
            phoneNumber: '+1 (555) 444-5555',
            specialty: 'Orthopedics',
            department: 'Orthopedics',
            availabilityStatus: 'on-leave',
            experience: 20,
            consultationFee: 300,
          },
        ];
        setDoctors(mockDoctors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [toast]);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Available';
      case 'offline':
        return 'Offline';
      case 'on-leave':
        return 'On Leave';
      default:
        return status;
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

  const handleVoiceClone = (doctorId: string, doctorName: string) => {
    setVoiceCloneModal({
      isOpen: true,
      doctorId,
      doctorName,
    });
  };

  const handleVoiceCloneSuccess = (voiceId: string) => {
    // Update the doctor in the local state
    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor._id === voiceCloneModal.doctorId
          ? { ...doctor, voiceId, voiceCloneStatus: 'completed' as const }
          : doctor,
      ),
    );
  };

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* <Sidebar /> */}

      <div className="flex-1 flex flex-col">
        {/* <Header user={user} /> */}

        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
                <p className="text-gray-600 mt-2">Manage doctor profiles and availability</p>
              </div>
              <Button
                onClick={() => router.push('/dashboard/doctors/add')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Doctor
              </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search doctors by name or specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Specialty: {specialtyFilter === 'all' ? 'All' : specialtyFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSpecialtyFilter('all')}>
                        All Specialties
                      </DropdownMenuItem>
                      {specialties.map((specialty) => (
                        <DropdownMenuItem
                          key={specialty}
                          onClick={() => setSpecialtyFilter(specialty)}
                        >
                          {specialty}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Doctors Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
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
                              <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                              <p className="text-sm text-blue-600 font-medium">
                                {doctor.specialty}
                              </p>
                              <p className="text-xs text-gray-500">{doctor.department}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(doctor.availabilityStatus)}>
                            {getStatusText(doctor.availabilityStatus)}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="truncate">{doctor.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{doctor.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Experience:</span>
                            <span className="text-gray-900">{doctor.experience} years</span>
                          </div>
                          {doctor.consultationFee && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Fee:</span>
                              <span className="text-gray-900 font-medium">
                                ${doctor.consultationFee}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Voice Clone Status */}
                        {doctor.voiceCloneStatus && (
                          <div className="mb-4">
                            <Badge className={getVoiceStatusColor(doctor.voiceCloneStatus)}>
                              Voice: {doctor.voiceCloneStatus}
                            </Badge>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVoiceClone(doctor._id, doctor.name)}
                            title="Clone Voice"
                          >
                            <Mic className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredDoctors.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || specialtyFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by adding your first doctor.'}
                  </p>
                  <Button onClick={() => router.push('/dashboard/doctors/add')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Doctor
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>
      </div>

      {/* Voice Clone Modal */}
      <VoiceCloneModal
        isOpen={voiceCloneModal.isOpen}
        onClose={() => setVoiceCloneModal((prev) => ({ ...prev, isOpen: false }))}
        doctorId={voiceCloneModal.doctorId}
        doctorName={voiceCloneModal.doctorName}
        onSuccess={handleVoiceCloneSuccess}
      />
    </div>
  );
}
