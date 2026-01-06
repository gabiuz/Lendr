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

    // Normalize business_profile_picture: keep public paths and data URLs as-is,
    // convert raw base64 strings (without data: prefix) to a data URL for rendering.
    if (ownerData.business_profile_picture && typeof ownerData.business_profile_picture === 'string') {
      const v = ownerData.business_profile_picture;
      if (v.startsWith('/') || v.startsWith('http')) {
        // public path or external URL — leave as-is
      } else if (v.startsWith('data:')) {
        // already a data URL — leave as-is
      } else if (/^[A-Za-z0-9+/=\s]+$/.test(v) && v.length > 50) {
        // likely base64 without data: prefix — convert to data URL
        ownerData.business_profile_picture = `data:image/jpeg;base64,${v}`;
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
