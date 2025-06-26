'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Filter, Plus, Eye, Edit, X } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Booking {
  id: string;
  patient: {
    name: string;
    avatar?: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialty: string;
    avatar?: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  consultationType: 'in-person' | 'video' | 'phone';
  symptoms?: string;
  fee?: number;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const [user] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@medicall.com',
    role: 'senior agent',
    avatar:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
  });

  // Mock data - replace with API call
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        patient: {
          name: 'John Doe',
          avatar:
            'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1 (555) 123-4567',
        },
        doctor: {
          name: 'Dr. Emily Wilson',
          specialty: 'Cardiology',
          avatar:
            'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00 AM',
        status: 'scheduled',
        consultationType: 'in-person',
        symptoms: 'Chest pain and shortness of breath',
        fee: 200,
      },
      {
        id: '2',
        patient: {
          name: 'Mary Smith',
          avatar:
            'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1 (555) 234-5678',
        },
        doctor: {
          name: 'Dr. Michael Chen',
          specialty: 'Neurology',
          avatar:
            'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        appointmentDate: '2024-01-15',
        appointmentTime: '2:00 PM',
        status: 'scheduled',
        consultationType: 'video',
        symptoms: 'Frequent headaches',
        fee: 250,
      },
      {
        id: '3',
        patient: {
          name: 'Robert Brown',
          phone: '+1 (555) 345-6789',
        },
        doctor: {
          name: 'Dr. Sarah Davis',
          specialty: 'Pediatrics',
          avatar:
            'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        appointmentDate: '2024-01-14',
        appointmentTime: '11:00 AM',
        status: 'completed',
        consultationType: 'in-person',
        symptoms: 'Regular checkup',
        fee: 180,
      },
      {
        id: '4',
        patient: {
          name: 'Lisa Garcia',
          avatar:
            'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1 (555) 456-7890',
        },
        doctor: {
          name: 'Dr. James Rodriguez',
          specialty: 'Orthopedics',
        },
        appointmentDate: '2024-01-13',
        appointmentTime: '3:30 PM',
        status: 'cancelled',
        consultationType: 'phone',
        symptoms: 'Knee pain',
        fee: 300,
      },
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    return statusFilter === 'all' || booking.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConsultationTypeColor = (type: string) => {
    switch (type) {
      case 'in-person':
        return 'bg-green-50 text-green-700';
      case 'video':
        return 'bg-blue-50 text-blue-700';
      case 'phone':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const stats = {
    total: bookings.length,
    scheduled: bookings.filter((b) => b.status === 'scheduled').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Active Bookings</h1>
                <p className="text-gray-600 mt-2">Manage patient appointments and schedules</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Scheduled</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.scheduled}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <User className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cancelled</p>
                      <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
                    </div>
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Status: {statusFilter === 'all' ? 'All' : statusFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                        All Bookings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('scheduled')}>
                        Scheduled
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                        Cancelled
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('no-show')}>
                        No Show
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
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
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Patient Info */}
                            <Avatar>
                              <AvatarImage
                                src={booking.patient.avatar}
                                alt={booking.patient.name}
                              />
                              <AvatarFallback>
                                {booking.patient.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {booking.patient.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Phone className="h-3 w-3" />
                                <span>{booking.patient.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            {/* Doctor Info */}
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{booking.doctor.name}</p>
                              <p className="text-sm text-blue-600">{booking.doctor.specialty}</p>
                            </div>
                            <Avatar>
                              <AvatarImage src={booking.doctor.avatar} alt={booking.doctor.name} />
                              <AvatarFallback>
                                {booking.doctor.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>

                            {/* Appointment Details */}
                            <div className="text-center">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                <Calendar className="h-3 w-3" />
                                <span>{booking.appointmentDate}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="h-3 w-3" />
                                <span>{booking.appointmentTime}</span>
                              </div>
                            </div>

                            {/* Status & Type */}
                            <div className="flex flex-col space-y-2">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getConsultationTypeColor(booking.consultationType)}
                              >
                                {booking.consultationType}
                              </Badge>
                            </div>

                            {/* Fee */}
                            {booking.fee && (
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">${booking.fee}</p>
                                <p className="text-xs text-gray-500">Fee</p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Symptoms */}
                        {booking.symptoms && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <strong>Symptoms:</strong> {booking.symptoms}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredBookings.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Calendar className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-500 mb-4">
                    {statusFilter !== 'all'
                      ? `No ${statusFilter} bookings at the moment.`
                      : 'No bookings have been made yet.'}
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Booking
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
