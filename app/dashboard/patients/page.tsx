'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Pause,
  Play,
  Download,
  User,
  Loader2,
} from 'lucide-react';
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
import { PatientService } from '@/lib/api/patients';
import { PatientResponse } from '@/types/patient';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      const params: { status?: string; search?: string } = {};

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await PatientService.getPatients(params);
      setPatients(response.patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPatients();
  }, []);

  // Refresh when filters change
  useEffect(() => {
    if (!isLoading) {
      setIsRefreshing(true);
      fetchPatients();
    }
  }, [searchTerm, statusFilter]);

  const handleStatusChange = async (
    patientId: string,
    newStatus: 'active' | 'paused' | 'completed',
  ) => {
    try {
      await PatientService.updatePatientStatus(patientId, newStatus);
      toast.success('Patient status updated successfully');

      // Update local state
      setPatients((prev) =>
        prev.map((patient) =>
          patient._id === patientId ? { ...patient, status: newStatus } : patient,
        ),
      );
    } catch (error) {
      console.error('Error updating patient status:', error);
      toast.error('Failed to update patient status', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-2">
            Manage patient records and medication schedules ({patients.length} patients)
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/patients/register')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Register Patient
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
                  placeholder="Search patients by name, email, or phone..."
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
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Patients
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                  Paused
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={() => fetchPatients()} disabled={isRefreshing}>
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : patients.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by registering your first patient.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button
                onClick={() => router.push('/dashboard/patients/register')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register First Patient
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <motion.div
              key={patient._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/patients/${patient._id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/patients/${patient._id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Patient
                        </DropdownMenuItem>
                        {patient.status === 'active' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(patient._id, 'paused')}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Reminders
                          </DropdownMenuItem>
                        )}
                        {patient.status === 'paused' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(patient._id, 'active')}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume Reminders
                          </DropdownMenuItem>
                        )}
                        {patient.status !== 'completed' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(patient._id, 'completed')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Mark Complete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-gray-900">{patient.mobileNumber}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Medications:</span>
                      <span className="text-gray-900">{patient.medications.length}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Reminder:</span>
                      <span className="text-gray-900">{formatDate(patient.lastReminderSent)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Next Reminder:</span>
                      <span className="text-gray-900">
                        {patient.status === 'active'
                          ? formatDate(patient.nextReminderDue)
                          : patient.status === 'paused'
                            ? 'Paused'
                            : 'Completed'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Status:</span>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
