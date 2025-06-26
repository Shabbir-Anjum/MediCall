import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 400 }
      );
    }

    // The actual logout is handled by NextAuth.js
    // This endpoint can be used for additional cleanup if needed

    return NextResponse.json({
      message: 'Logout successful',
      success: true
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
