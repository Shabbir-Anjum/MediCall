'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Eye,
} from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CallLog {
  id: string;
  patient: {
    name: string;
    avatar?: string;
    phone: string;
  };
  agent: {
    name: string;
    avatar?: string;
  };
  callType: 'reminder' | 'appointment' | 'emergency' | 'follow-up';
  outcome: 'completed' | 'no-answer' | 'busy' | 'transferred-emergency' | 'appointment-requested';
  duration?: number;
  callDateTime: string;
  remarks?: string;
}

export default function CallHistoryPage() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');
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
    const mockCallLogs: CallLog[] = [
      {
        id: '1',
        patient: {
          name: 'John Doe',
          avatar:
            'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1 (555) 123-4567',
        },
        agent: {
          name: 'Sarah Johnson',
          avatar:
            'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        callType: 'reminder',
        outcome: 'completed',
        duration: 120,
        callDateTime: '2024-01-15 09:00 AM',
        remarks: 'Patient confirmed medication taken',
      },
      {
        id: '2',
        patient: {
          name: 'Mary Smith',
          avatar:
            'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1 (555) 234-5678',
        },
        agent: {
          name: 'Mike Wilson',
        },
        callType: 'appointment',
        outcome: 'appointment-requested',
        duration: 180,
        callDateTime: '2024-01-15 10:30 AM',
        remarks: 'Appointment booked with Dr. Wilson for Jan 20',
      },
      {
        id: '3',
        patient: {
          name: 'Robert Brown',
          phone: '+1 (555) 345-6789',
        },
        agent: {
          name: 'Lisa Garcia',
        },
        callType: 'emergency',
        outcome: 'transferred-emergency',
        duration: 45,
        callDateTime: '2024-01-15 11:15 AM',
        remarks: 'Emergency transfer initiated - chest pain',
      },
      {
        id: '4',
        patient: {
          name: 'Emma Davis',
          avatar:
            'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1 (555) 456-7890',
        },
        agent: {
          name: 'Sarah Johnson',
          avatar:
            'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        callType: 'reminder',
        outcome: 'no-answer',
        callDateTime: '2024-01-15 02:00 PM',
        remarks: 'Follow-up scheduled for tomorrow',
      },
      {
        id: '5',
        patient: {
          name: 'Alice Cooper',
          phone: '+1 (555) 567-8901',
        },
        agent: {
          name: 'Mike Wilson',
        },
        callType: 'follow-up',
        outcome: 'completed',
        duration: 90,
        callDateTime: '2024-01-15 03:30 PM',
        remarks: 'Patient feeling better, medication working well',
      },
    ];

    setTimeout(() => {
      setCallLogs(mockCallLogs);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredCallLogs = callLogs.filter((log) => {
    return outcomeFilter === 'all' || log.outcome === outcomeFilter;
  });

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'no-answer':
        return 'bg-yellow-100 text-yellow-800';
      case 'busy':
        return 'bg-orange-100 text-orange-800';
      case 'transferred-emergency':
        return 'bg-red-100 text-red-800';
      case 'appointment-requested':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-50 text-blue-700';
      case 'appointment':
        return 'bg-green-50 text-green-700';
      case 'emergency':
        return 'bg-red-50 text-red-700';
      case 'follow-up':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'no-answer':
        return <XCircle className="h-4 w-4 text-yellow-600" />;
      case 'busy':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'transferred-emergency':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'appointment-requested':
        return <User className="h-4 w-4 text-blue-600" />;
      default:
        return <Phone className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const stats = {
    total: callLogs.length,
    completed: callLogs.filter((log) => log.outcome === 'completed').length,
    noAnswer: callLogs.filter((log) => log.outcome === 'no-answer').length,
    emergency: callLogs.filter((log) => log.outcome === 'transferred-emergency').length,
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Call History</h1>
                <p className="text-gray-600 mt-2">Track and analyze call center performance</p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Calls</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <Phone className="h-8 w-8 text-blue-600" />
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
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">No Answer</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.noAnswer}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Emergency</p>
                      <p className="text-3xl font-bold text-red-600">{stats.emergency}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
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
                        Outcome: {outcomeFilter === 'all' ? 'All' : outcomeFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setOutcomeFilter('all')}>
                        All Outcomes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOutcomeFilter('completed')}>
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOutcomeFilter('no-answer')}>
                        No Answer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOutcomeFilter('busy')}>
                        Busy
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOutcomeFilter('transferred-emergency')}>
                        Emergency Transfer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOutcomeFilter('appointment-requested')}>
                        Appointment Requested
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Call Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Call Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Date/Time</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCallLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={log.patient.avatar} alt={log.patient.name} />
                                <AvatarFallback className="text-xs">
                                  {log.patient.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">{log.patient.name}</p>
                                <p className="text-sm text-gray-500">{log.patient.phone}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={log.agent.avatar} alt={log.agent.name} />
                                <AvatarFallback className="text-xs">
                                  {log.agent.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-900">{log.agent.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getCallTypeColor(log.callType)}>
                              {log.callType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getOutcomeIcon(log.outcome)}
                              <Badge className={getOutcomeColor(log.outcome)}>
                                {log.outcome.replace('-', ' ')}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-900">
                              {formatDuration(log.duration)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-900">{log.callDateTime}</span>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {filteredCallLogs.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Phone className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No call logs found</h3>
                    <p className="text-gray-500">
                      {outcomeFilter !== 'all'
                        ? `No calls with ${outcomeFilter} outcome found.`
                        : 'No calls have been made yet.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
