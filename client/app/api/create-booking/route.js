import { query } from '@/source/database.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customer_id,
      product_id,
      start_date,
      end_date,
      total_amount,
      payment_method,
      delivery_option,
    } = body;

    // Validate required fields
    if (!customer_id || !product_id || !start_date || !end_date || !total_amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    // Normalize payment method to match DB/check constraints if needed
    const pm = payment_method
      ? payment_method.toString().toLowerCase() === 'cash'
        ? 'Cash'
        : payment_method.toString().toLowerCase() === 'gcash'
        ? 'Gcash'
        : payment_method
      : null;

    // Insert booking into rentals table
    const result = await query({
      query: `
        INSERT INTO rentals 
        (customer_id, product_id, start_date, end_date, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      values: [
        customer_id,
        product_id,
        start_date,
        end_date,
        total_amount,
        'To ship',
      ],
    });

    const rentalId = result.insertId;

    // Always create a payment record with Pending status
    try {
      const paymentMethod = pm || 'Cash'; // Default to Cash if no method provided
      await query({
        query: `INSERT INTO payments (rental_id, payment_date, payment_method, amount_paid, payment_status) VALUES (?, NOW(), ?, ?, ?)`,
        values: [rentalId, paymentMethod, total_amount, 'Pending'],
      });
    } catch (e) {
      console.warn('Failed to insert payment record:', e.message || e);
      // continue even if payments insert fails
    }

    // Mark product as reserved (if advance booking) or rented (if same-day booking)
    try {
      const startDateObj = new Date(start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // If start_date is in the future, mark as Reserved; otherwise mark as Rented
      const status = startDateObj > today ? 'Reserved' : 'Rented';
      
      await query({
        query: 'UPDATE products SET availability_status = ? WHERE product_id = ?',
        values: [status, product_id],
      });
    } catch (e) {
      console.warn('Failed to update product availability:', e.message || e);
    }

    return NextResponse.json({
      success: true,
      rental_id: rentalId,
      message: 'Booking confirmed successfully',
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
