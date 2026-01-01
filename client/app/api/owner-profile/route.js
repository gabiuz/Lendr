import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner_id = searchParams.get('owner_id');

    if (!owner_id) {
      return NextResponse.json(
        { success: false, error: 'missing owner_id' },
        { status: 400 }
      );
    }

    const rows = await query({
      query: 'SELECT * FROM rental_owner WHERE owner_id = ?',
      values: [owner_id],
    });

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'owner not found' },
        { status: 404 }
      );
    }

    const ownerData = rows[0];
    let customerData = null;

    // Fetch customer data if customer_id is available
    if (ownerData.customer_id) {
      const customerRows = await query({
        query: 'SELECT * FROM customer WHERE customer_id = ?',
        values: [ownerData.customer_id],
      });
      if (customerRows && customerRows.length > 0) {
        customerData = customerRows[0];
      }
    }

    return NextResponse.json({
      success: true,
      data: ownerData,
      customer: customerData,
    });
  } catch (error) {
    console.error('Error fetching owner profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
