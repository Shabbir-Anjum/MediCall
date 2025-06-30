'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Bell, Phone, Mail, Shield, User, Database } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [user] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@medicall.com',
    role: 'senior agent',
    avatar:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
  });

  const [settings, setSettings] = useState({
    profile: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@medicall.com',
      phone: '+1 (555) 123-4567',
      department: 'Call Center',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      emergencyAlerts: true,
    },
    callCenter: {
      autoDialEnabled: true,
      callRecording: true,
      voicemailTranscription: false,
      callTimeout: 30,
    },
    system: {
      blandAiApiKey: '',
      mongodbUri: '',
      smtpHost: '',
      smtpPort: 587,
    },
  });

  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Settings Saved',
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account and system preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="call-center">Call Center</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={settings.profile.name}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, name: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, email: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={settings.profile.phone}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, phone: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={settings.profile.department}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, department: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSave('Profile')}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, emailNotifications: checked },
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.notifications.smsNotifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, smsNotifications: checked },
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive browser push notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, pushNotifications: checked },
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Emergency Alerts</Label>
                        <p className="text-sm text-gray-500">
                          Receive immediate emergency notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.emergencyAlerts}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, emergencyAlerts: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSave('Notification')}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Notifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Call Center Settings */}
              <TabsContent value="call-center">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Center Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Dial</Label>
                        <p className="text-sm text-gray-500">
                          Automatically dial next patient in queue
                        </p>
                      </div>
                      <Switch
                        checked={settings.callCenter.autoDialEnabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            callCenter: { ...prev.callCenter, autoDialEnabled: checked },
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Call Recording</Label>
                        <p className="text-sm text-gray-500">
                          Record all calls for quality assurance
                        </p>
                      </div>
                      <Switch
                        checked={settings.callCenter.callRecording}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            callCenter: { ...prev.callCenter, callRecording: checked },
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Voicemail Transcription</Label>
                        <p className="text-sm text-gray-500">Automatically transcribe voicemails</p>
                      </div>
                      <Switch
                        checked={settings.callCenter.voicemailTranscription}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            callCenter: { ...prev.callCenter, voicemailTranscription: checked },
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="timeout">Call Timeout (seconds)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        min="10"
                        max="120"
                        value={settings.callCenter.callTimeout}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            callCenter: {
                              ...prev.callCenter,
                              callTimeout: parseInt(e.target.value) || 30,
                            },
                          }))
                        }
                        className="mt-1 max-w-xs"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        How long to wait before considering a call unanswered
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSave('Call Center')}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Call Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System Settings */}
              <TabsContent value="system">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      System Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="blandai">Bland.ai API Key</Label>
                      <Input
                        id="blandai"
                        type="password"
                        value={settings.system.blandAiApiKey}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            system: { ...prev.system, blandAiApiKey: e.target.value },
                          }))
                        }
                        placeholder="Enter your Bland.ai API key"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mongodb">MongoDB URI</Label>
                      <Input
                        id="mongodb"
                        type="password"
                        value={settings.system.mongodbUri}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            system: { ...prev.system, mongodbUri: e.target.value },
                          }))
                        }
                        placeholder="mongodb+srv://..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtp-host">SMTP Host</Label>
                        <Input
                          id="smtp-host"
                          value={settings.system.smtpHost}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              system: { ...prev.system, smtpHost: e.target.value },
                            }))
                          }
                          placeholder="smtp.example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtp-port">SMTP Port</Label>
                        <Input
                          id="smtp-port"
                          type="number"
                          value={settings.system.smtpPort}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              system: { ...prev.system, smtpPort: parseInt(e.target.value) || 587 },
                            }))
                          }
                          placeholder="587"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSave('System')}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save System Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
