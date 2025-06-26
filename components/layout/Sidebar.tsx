'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Stethoscope,
  Calendar,
  Phone,
  Settings,
  Menu,
  X,
  Building2,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Register Patient',
    href: '/patients/register',
    icon: UserPlus,
  },
  {
    name: 'Patients',
    href: '/patients',
    icon: Users,
  },
  {
    name: 'Doctors',
    href: '/doctors',
    icon: Stethoscope,
  },
  {
    name: 'Active Bookings',
    href: '/bookings',
    icon: Calendar,
  },
  {
    name: 'Call History',
    href: '/calls',
    icon: Phone,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            {!collapsed && (
              <>
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="font-bold text-gray-900">MediCall</h1>
                  <p className="text-xs text-gray-500">Call Center</p>
                </div>
              </>
            )}
          </motion.div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <Menu className="h-5 w-5 text-gray-600" />
            ) : (
              <X className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive ? 'text-blue-600' : 'text-gray-500')} />
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="font-medium"
              >
                {!collapsed && item.name}
              </motion.span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="ml-auto h-2 w-2 bg-blue-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-gray-500 text-center"
        >
          {!collapsed && '© 2024 MediCall System'}
        </motion.div>
      </div>
    </motion.div>
  );
}
