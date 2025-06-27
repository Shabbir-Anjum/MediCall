'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Eye, Edit, Calendar, Phone, Mail, Mic, User } from 'lucide-react';
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
import { toast } from 'sonner';
import { doctorService } from '@/lib/api/doctors';
import { DoctorResponse } from '@/types/doctor';

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [voiceCloneModal, setVoiceCloneModal] = useState<{
    isOpen: boolean;
    doctorId: string;
    doctorName: string;
  }>({
    isOpen: false,
    doctorId: '',
    doctorName: '',
  });

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await doctorService.getDoctors({
          search: searchTerm || undefined,
          specialty: specialtyFilter !== 'all' ? specialtyFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          page: currentPage,
          limit: 10,
        });

        setDoctors(response.doctors);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors', { description: error.message });
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [searchTerm, specialtyFilter, statusFilter, currentPage]);

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
    setVoiceCloneModal({ isOpen: false, doctorId: '', doctorName: '' });
    toast.success('Voice clone initiated successfully');
    // Refresh the doctors list to update voice clone status
    window.location.reload();
  };

  const handleVoiceCloneError = (error: string) => {
    setVoiceCloneModal({ isOpen: false, doctorId: '', doctorName: '' });
    toast.error('Voice clone failed', { description: error });
  };

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
                <p className="text-gray-600">Manage hospital doctors and their availability</p>
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
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div>
                    <select
                      value={specialtyFilter}
                      onChange={(e) => setSpecialtyFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Specialties</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="online">Available</option>
                      <option value="offline">Offline</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctors Grid */}
            {doctors.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No doctors found</h3>
                    <p className="mb-4">
                      {searchTerm || specialtyFilter !== 'all' || statusFilter !== 'all'
                        ? 'Try adjusting your search criteria'
                        : 'Get started by adding your first doctor'}
                    </p>
                    <Button
                      onClick={() => router.push('/dashboard/doctors/add')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Doctor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={doctor.avatar} alt={doctor.name} />
                              <AvatarFallback>
                                {doctor.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                  />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/doctors/${doctor._id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/doctors/${doctor._id}/edit`)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleVoiceClone(doctor._id, doctor.name)}
                              >
                                <Mic className="h-4 w-4 mr-2" />
                                Clone Voice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{doctor.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{doctor.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{doctor.experience} years experience</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <Badge className={getStatusColor(doctor.availabilityStatus)}>
                            {getStatusText(doctor.availabilityStatus)}
                          </Badge>
                          {doctor.voiceCloneStatus && (
                            <Badge className={getVoiceStatusColor(doctor.voiceCloneStatus)}>
                              Voice {doctor.voiceCloneStatus}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Voice Clone Modal */}
      <VoiceCloneModal
        isOpen={voiceCloneModal.isOpen}
        doctorId={voiceCloneModal.doctorId}
        doctorName={voiceCloneModal.doctorName}
        onSuccess={handleVoiceCloneSuccess}
        onClose={() => setVoiceCloneModal({ isOpen: false, doctorId: '', doctorName: '' })}
      />
    </div>
  );
}
