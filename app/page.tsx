'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Phone, Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Update loading state based on session status
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  const features = [
    {
      icon: Phone,
      title: 'Automated Calls',
      description: 'AI-powered voice calls for medication reminders and appointment confirmations',
    },
    {
      icon: Users,
      title: 'Patient Management',
      description:
        'Comprehensive patient database with medication schedules and contact information',
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Streamlined booking system with doctor availability and patient preferences',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MediCall</h1>
                <p className="text-sm text-gray-500">Hospital Call Center System</p>
              </div>
            </div>
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => router.push('/auth/login')}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push('/auth/signup')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {isAuthenticated ? (
              <>
                Welcome back to
                <span className="block text-blue-600">MediCall Dashboard</span>
              </>
            ) : (
              <>
                Streamline Your Hospital's
                <span className="block text-blue-600">Call Center Operations</span>
              </>
            )}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {isAuthenticated
              ? 'Continue managing your patients, appointments, and call center operations.'
              : 'Automate patient reminders, manage appointments, and track call outcomes with our comprehensive call center management system powered by AI.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Access Dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => router.push('/auth/signup')}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3"
                  onClick={() => router.push('/dashboard')}
                >
                  View Demo
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">
            {isAuthenticated ? 'Ready to Continue?' : 'Ready to Transform Your Call Center?'}
          </h3>
          <p className="text-blue-100 mb-8 text-lg">
            {isAuthenticated
              ? 'Jump back into managing your healthcare operations efficiently.'
              : 'Join hundreds of healthcare facilities already using MediCall to improve patient care.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push('/dashboard')}
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => router.push('/auth/signup')}
                  className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3"
                >
                  Start Your Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/auth/login')}
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
