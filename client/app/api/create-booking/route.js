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

    // Insert booking into rentals table. Note: rentals table doesn't have payment_method/delivery_option columns
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

    // Optionally record a payment record in the payments table if payment method provided
    if (pm) {
      try {
        await query({
          query: `INSERT INTO payments (rental_id, payment_date, payment_method, amount_paid, payment_status) VALUES (?, NOW(), ?, ?, ?)`,
          values: [rentalId, pm, total_amount, 'Paid'],
        });
      } catch (e) {
        console.warn('Failed to insert payment record:', e.message || e);
        // continue even if payments insert fails
      }
    }

    // Mark product as rented so owner views show updated availability
    try {
      await query({
        query: 'UPDATE products SET availability_status = ? WHERE product_id = ?',
        values: ['Rented', product_id],
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
