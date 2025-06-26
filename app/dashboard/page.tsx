'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Phone,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [user] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@medicall.com',
    role: 'senior agent',
    avatar:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
  });

  const [dashboardData, setDashboardData] = useState({
    totalPatients: 1247,
    pendingCalls: 23,
    activeBookings: 156,
    emergencyAlerts: 2,
    callsToday: 45,
    successRate: 94,
  });

  const recentActivities = [
    {
      id: 1,
      type: 'call',
      patient: 'John Doe',
      action: 'Medication reminder call completed',
      time: '2 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'appointment',
      patient: 'Mary Smith',
      action: 'Appointment booked with Dr. Wilson',
      time: '15 minutes ago',
      status: 'success',
    },
    {
      id: 3,
      type: 'emergency',
      patient: 'Robert Brown',
      action: 'Emergency transfer initiated',
      time: '1 hour ago',
      status: 'alert',
    },
    {
      id: 4,
      type: 'call',
      patient: 'Lisa Garcia',
      action: 'No answer - follow-up scheduled',
      time: '2 hours ago',
      status: 'warning',
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: 'Call reminder for diabetes medication',
      patient: 'Alice Cooper',
      time: '10:30 AM',
      priority: 'high',
    },
    {
      id: 2,
      task: 'Appointment confirmation call',
      patient: 'Mike Johnson',
      time: '11:00 AM',
      priority: 'medium',
    },
    {
      id: 3,
      task: 'Follow-up on missed call',
      patient: 'Emma Davis',
      time: '2:00 PM',
      priority: 'low',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header user={user} />

        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Good morning, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600">Here's what's happening in your call center today.</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Patients"
              value={dashboardData.totalPatients.toLocaleString()}
              change="+12% from last month"
              changeType="positive"
              icon={Users}
              color="blue"
              index={0}
            />
            <StatsCard
              title="Pending Calls"
              value={dashboardData.pendingCalls}
              change="Due in next 2 hours"
              changeType="neutral"
              icon={Phone}
              color="yellow"
              index={1}
            />
            <StatsCard
              title="Active Bookings"
              value={dashboardData.activeBookings}
              change="+8% from yesterday"
              changeType="positive"
              icon={Calendar}
              color="green"
              index={2}
            />
            <StatsCard
              title="Emergency Alerts"
              value={dashboardData.emergencyAlerts}
              change="Requires immediate attention"
              changeType="negative"
              icon={AlertTriangle}
              color="red"
              index={3}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Activities
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {activity.status === 'success' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {activity.status === 'alert' && (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                          {activity.status === 'warning' && (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.patient}</p>
                          <p className="text-sm text-gray-500">{activity.action}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant={
                              task.priority === 'high'
                                ? 'destructive'
                                : task.priority === 'medium'
                                  ? 'default'
                                  : 'secondary'
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">{task.time}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{task.task}</p>
                        <p className="text-xs text-gray-500">{task.patient}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All Tasks
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Users className="h-6 w-6" />
                    <span>Register Patient</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Phone className="h-6 w-6" />
                    <span>Make Call</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Calendar className="h-6 w-6" />
                    <span>Book Appointment</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span>View Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
