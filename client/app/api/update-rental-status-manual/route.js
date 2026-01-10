import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { rental_id, status } = body;

    // Validate inputs
    if (!rental_id || !status) {
      return NextResponse.json(
        { success: false, error: 'rental_id and status are required' },
        { status: 400 }
      );
    }

    // Update the rental status
    const result = await query({
      query: 'UPDATE rentals SET status = ? WHERE rental_id = ?',
      values: [status, rental_id],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Rental not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated rental status to ${status}`,
    });
  } catch (error) {
    console.error('Error updating rental status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
