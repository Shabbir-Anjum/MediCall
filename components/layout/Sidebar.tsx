'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  UserCheck,
  Calendar,
  Phone,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Building2,
  },
  {
    title: 'Patients',
    href: '/dashboard/patients',
    icon: Users,
  },
  {
    title: 'Doctors',
    href: '/dashboard/doctors',
    icon: UserCheck,
  },
  {
    title: 'Bookings',
    href: '/dashboard/bookings',
    icon: Calendar,
  },
  {
    title: 'Call Logs',
    href: '/dashboard/calls',
    icon: Phone,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/auth/login',
        redirect: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect
      router.push('/auth/login');
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediCall</h1>
                <p className="text-xs text-gray-500">Call Center</p>
              </div>
            </motion.div>
          )}
          {onToggle && (
            <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-medium"
                  >
                    {item.title}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-200">
        {session?.user && (
          <div className="mb-4">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm"
              >
                <p className="font-medium text-gray-900 truncate">
                  {session.user.name || session.user.email}
                </p>
                <p className="text-xs text-gray-500">Agent</p>
              </motion.div>
            )}
          </div>
        )}

        <Button
          variant="outline"
          onClick={handleLogout}
          className={cn('w-full justify-start', isCollapsed ? 'px-2' : 'px-3')}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="ml-3"
            >
              Logout
            </motion.span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
