import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function POST(request) {
  try {
    // Try to get parameters from query string first (for our use case)
    const { searchParams } = new URL(request.url);
    let rental_id = searchParams.get('rental_id');
    let payment_status = searchParams.get('payment_status');

    // If not in query params, try to read from body (for backward compatibility)
    if (!rental_id || !payment_status) {
      try {
        const body = await request.json();
        rental_id = rental_id || body.rental_id;
        payment_status = payment_status || body.payment_status;
      } catch {
        // Body might not be JSON, continue with query params
      }
    }

    // Validate inputs
    if (!rental_id || !payment_status) {
      return NextResponse.json(
        { success: false, error: 'rental_id and payment_status are required' },
        { status: 400 }
      );
    }

    // Update the payment status
    const result = await query({
      query: 'UPDATE payments SET payment_status = ? WHERE rental_id = ?',
      values: [payment_status, rental_id],
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Payment record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated payment status to ${payment_status}`,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
