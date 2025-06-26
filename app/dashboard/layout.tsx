'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      return; // Still loading
    }

    if (!session) {
      // Not authenticated, redirect to login
      router.push('/auth/login');
      return;
    }

    // User is authenticated
    setIsLoading(false);
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === 'loading' || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!session) {
    return null;
  }

  // User data from session
  const user = {
    name: session.user?.name || 'Agent',
    email: session.user?.email || 'agent@medicall.com',
    role: 'agent',
    avatar: session.user?.avatar || undefined,
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sticky Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="flex-shrink-0">
          <Header user={user} />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
