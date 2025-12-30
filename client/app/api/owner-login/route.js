import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { contact_email, password } = body;
    
    if (!contact_email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // First, check if email exists in rental_owner table (business email)
    const ownerRows = await query({
      query: 'SELECT owner_id FROM rental_owner WHERE contact_email = ?',
      values: [contact_email]
    });

    if (ownerRows && ownerRows.length > 0) {
      // Email found in rental_owner, now validate password against customer table
      const customerRows = await query({
        query: 'SELECT customer_id, account_password FROM customer WHERE email = ?',
        values: [contact_email]
      });

      if (customerRows && customerRows.length > 0) {
        const customer = customerRows[0];
        if (customer.account_password) {
          const passwordMatch = await bcrypt.compare(password, customer.account_password);
          if (passwordMatch) {
            return NextResponse.json({
              success: true,
              owner_id: ownerRows[0].owner_id,
              message: 'Login successful'
            });
          }
        }
      }
      
      // Password didn't match or no customer account found
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // If not found in rental_owner, check customer table (personal email)
    const customerRows = await query({
      query: 'SELECT customer_id, account_password FROM customer WHERE email = ?',
      values: [contact_email]
    });

    if (customerRows && customerRows.length > 0) {
      const customer = customerRows[0];
      if (customer.account_password) {
        const passwordMatch = await bcrypt.compare(password, customer.account_password);
        if (passwordMatch) {
          // Use customer_id as owner_id for dashboard access
          return NextResponse.json({
            success: true,
            owner_id: customer.customer_id,
            message: 'Login successful'
          });
        }
      }
    }

    // Not found in either table or password invalid
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (err) {
    console.error('Owner login error:', err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
