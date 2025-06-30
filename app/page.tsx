'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Phone as PhoneIcon,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Zap,
  Heart,
  Play,
  MessageCircle,
  Bell,
  Clock,
  TrendingUp,
  ChevronDown,
  Mail,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: PhoneIcon,
      title: 'AI-Powered Voice Calls',
      description: 'Intelligent automated calls that sound human and adapt to patient responses',
      color: 'from-blue-500 to-purple-600',
    },
    {
      icon: Users,
      title: 'Smart Patient Management',
      description: 'Comprehensive patient database with medication schedules and preferences',
      color: 'from-green-500 to-teal-600',
    },
    {
      icon: Calendar,
      title: 'Automated Scheduling',
      description: 'Seamless appointment booking with intelligent reminder systems',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade security with full compliance and data protection',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: Zap,
      title: 'Real-time Analytics',
      description: 'Live insights into call outcomes, patient engagement, and system performance',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: Heart,
      title: 'Patient-Centric Care',
      description: 'Personalized care plans that improve patient outcomes and satisfaction',
      color: 'from-pink-500 to-rose-600',
    },
  ];

  const stats = [
    { number: '500+', label: 'Healthcare Facilities' },
    { number: '2M+', label: 'Patients Served' },
    { number: '95%', label: 'Patient Satisfaction' },
    { number: '40%', label: 'Adherence Improvement' },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      hospital: 'Mercy General Hospital',
      content:
        'MediCall has transformed our patient communication. Our medication adherence rates increased by 40% in just 3 months.',
      rating: 5,
      avatar: '/avatars/sarah.jpg',
    },
    {
      name: 'Michael Chen',
      role: 'Hospital Administrator',
      hospital: 'City Medical Center',
      content:
        'The AI voice calls are incredibly natural. Patients actually prefer them over human calls for routine reminders.',
      rating: 5,
      avatar: '/avatars/michael.jpg',
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Family Medicine',
      hospital: 'Community Health Network',
      content:
        'Finally, a system that actually works for busy healthcare providers. It saves us hours every day.',
      rating: 5,
      avatar: '/avatars/emily.jpg',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small clinics and practices',
      features: [
        'Up to 1,000 patients',
        'Basic AI voice calls',
        'Email support',
        'Standard integrations',
        'Basic analytics',
      ],
      popular: false,
      color: 'from-gray-500 to-gray-600',
    },
    {
      name: 'Professional',
      price: '$299',
      period: '/month',
      description: 'Ideal for growing healthcare facilities',
      features: [
        'Up to 10,000 patients',
        'Advanced AI voice calls',
        'Priority support',
        'Advanced integrations',
        'Detailed analytics',
        'Custom workflows',
        'Multi-location support',
      ],
      popular: true,
      color: 'from-blue-500 to-teal-600',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large hospital systems and networks',
      features: [
        'Unlimited patients',
        'Custom AI voice models',
        '24/7 dedicated support',
        'Custom integrations',
        'Advanced analytics',
        'White-label options',
        'On-premise deployment',
        'Custom training',
      ],
      popular: false,
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  const faqs = [
    {
      question: 'How does the AI voice calling work?',
      answer:
        'Our AI uses advanced natural language processing to create human-like conversations. It can understand patient responses, handle objections, and adapt the conversation flow in real-time.',
    },
    {
      question: 'Is MediCall HIPAA compliant?',
      answer:
        'Yes, MediCall is fully HIPAA compliant. We use enterprise-grade encryption, secure data centers, and follow all healthcare privacy regulations to protect patient information.',
    },
    {
      question: 'Can I integrate with my existing systems?',
      answer:
        'Absolutely! MediCall integrates with most major EHR systems, practice management software, and healthcare platforms. We also offer custom integrations for specific needs.',
    },
    {
      question: 'What kind of support do you provide?',
      answer:
        'We offer comprehensive support including setup assistance, training, and ongoing technical support. Enterprise customers get dedicated account managers and 24/7 priority support.',
    },
    {
      question: 'How quickly can I get started?',
      answer:
        'Most customers can be up and running within 24-48 hours. Our team handles the initial setup and provides training to get you started quickly.',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 text-lg">Loading MediCall...</p>
        </motion.div>
      </div>
    );
  }

  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <Building2 className="h-10 w-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  MediCall
                </h1>
                <p className="text-sm text-gray-500">Next-Gen Healthcare Communication</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex space-x-4"
            >
              {isAuthenticated ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => router.push('/auth/login')}
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full transition-all duration-300"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push('/auth/signup')}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started Free
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8"
            >
              <Star className="h-4 w-4 mr-2 fill-current" />
              Trusted by 500+ healthcare facilities worldwide
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              {isAuthenticated ? (
                <>
                  Welcome back to
                  <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    MediCall
                  </span>
                </>
              ) : (
                <>
                  Revolutionize Your
                  <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Healthcare Communication
                  </span>
                </>
              )}
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              {isAuthenticated
                ? 'Continue managing your patients, appointments, and call center operations with our AI-powered platform.'
                : 'Transform patient care with AI-powered voice calls, smart scheduling, and intelligent reminders. Reduce no-shows by 60% and improve medication adherence by 40%.'}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              {isAuthenticated ? (
                <Button
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Access Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => router.push('/auth/signup')}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  >
                    Start Free Trial
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 text-lg"
                    onClick={() => router.push('/dashboard')}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Demo
                  </Button>
                </>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500"
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-500" />
                <span className="text-sm">40% Better Outcomes</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="relative bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Modern Healthcare
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful features designed specifically for healthcare providers to improve patient
                outcomes and streamline operations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Loved by Healthcare Professionals
              </h3>
              <p className="text-xl text-gray-600">
                See what our customers are saying about MediCall
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Dr. Sarah Johnson',
                  role: 'Chief Medical Officer',
                  hospital: 'Mercy General Hospital',
                  content:
                    'MediCall has transformed our patient communication. Our medication adherence rates increased by 40% in just 3 months.',
                  rating: 5,
                },
                {
                  name: 'Michael Chen',
                  role: 'Hospital Administrator',
                  hospital: 'City Medical Center',
                  content:
                    'The AI voice calls are incredibly natural. Patients actually prefer them over human calls for routine reminders.',
                  rating: 5,
                },
                {
                  name: 'Dr. Emily Rodriguez',
                  role: 'Family Medicine',
                  hospital: 'Community Health Network',
                  content:
                    'Finally, a system that actually works for busy healthcare providers. It saves us hours every day.',
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                        &ldquo;{testimonial.content}&rdquo;
                      </blockquote>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">
                          {testimonial.role} at {testimonial.hospital}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the plan that fits your healthcare facility. All plans include our core
                features.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <Card
                    className={`h-full border-2 transition-all duration-300 ${
                      plan.popular
                        ? 'border-blue-600 shadow-xl'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CardHeader className="text-center pb-8">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {plan.name}
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      <p className="text-gray-600 mt-2">{plan.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full mt-8 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                        onClick={() => router.push('/auth/signup')}
                      >
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <p className="text-xl text-gray-600">Everything you need to know about MediCall</p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 transition-transform ${
                            openFaq === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold text-white mb-6">
                {isAuthenticated ? 'Ready to Continue?' : 'Ready to Transform Your Healthcare?'}
              </h3>
              <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                {isAuthenticated
                  ? 'Jump back into managing your healthcare operations efficiently.'
                  : 'Join hundreds of healthcare facilities already using MediCall to improve patient care and reduce operational costs.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                {isAuthenticated ? (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => router.push('/dashboard')}
                    className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
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
                      className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    >
                      Start Your Free Trial
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push('/auth/login')}
                      className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full transition-all duration-300 text-lg"
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">MediCall</span>
              </div>
              <p className="text-gray-400 mb-6">
                Next-generation healthcare communication platform powered by AI. Transforming
                patient care through intelligent automation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <PhoneIcon className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Training
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; 2024 MediCall. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
