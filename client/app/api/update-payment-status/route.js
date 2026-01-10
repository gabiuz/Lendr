import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { rental_id, payment_status } = body;

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
