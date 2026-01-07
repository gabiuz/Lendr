// This route initializes the rental status scheduler
// Call this once on application startup

import { NextResponse } from 'next/server';
import { startRentalStatusScheduler } from '@/source/rentalStatusScheduler.js';

export async function GET(request) {
  try {
    startRentalStatusScheduler();
    return NextResponse.json({
      success: true,
      message: 'Rental status scheduler initialized',
    });
  } catch (error) {
    console.error('Error initializing scheduler:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
