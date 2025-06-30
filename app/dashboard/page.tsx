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
  UserPlus,
  Settings,
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
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
    <>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning, Sarah! 👋</h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening in your call center today.
        </p>
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
              <CardTitle className="flex items-center justify-between">
                Upcoming Tasks
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
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
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{task.patient}</p>
                    <p className="text-xs text-gray-400">{task.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Content for Scrolling Test */}
      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.callsToday}</div>
                <div className="text-sm text-gray-600">Calls Today</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData.successRate}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">12.5</div>
                <div className="text-sm text-gray-600">Avg Call Duration (min)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <UserPlus className="h-6 w-6" />
                <span className="text-sm">Add Patient</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Book Appointment</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Phone className="h-6 w-6" />
                <span className="text-sm">Make Call</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Settings className="h-6 w-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional sections for scrolling test */}
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Section {i + 1} - Scroll Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This is additional content to test the sticky sidebar and header behavior. As you
                scroll down, the sidebar and header should remain fixed in place.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Feature {i + 1}</h4>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Feature {i + 2}</h4>
                  <p className="text-sm text-gray-600">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
