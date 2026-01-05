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
    
    // Fetch customer data to get owner's name
    let customerData = null;
    if (ownerData.customer_id) {
      const customerRows = await query({
        query: 'SELECT first_name, middle_name, last_name FROM customer WHERE customer_id = ?',
        values: [ownerData.customer_id],
      });
      if (customerRows && customerRows.length > 0) {
        customerData = customerRows[0];
      }
    }
    
    // Handle business_profile_picture - if it's a string base64, add data URL prefix
    if (ownerData.business_profile_picture && typeof ownerData.business_profile_picture === 'string' && !ownerData.business_profile_picture.startsWith('data:')) {
      ownerData.business_profile_picture = `data:image/jpeg;base64,${ownerData.business_profile_picture}`;
    }

    return NextResponse.json({
      success: true,
      profile: ownerData,
      customer: customerData,
    });
  } catch (error) {
    console.error('Error fetching owner profile settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { owner_id, first_name, last_name, contact_email, contact_number, business_name, business_address, business_description, business_profile_picture } = body;

    if (!owner_id) {
      return NextResponse.json(
        { success: false, error: 'missing owner_id' },
        { status: 400 }
      );
    }

    // Check if owner exists
    const checkRows = await query({
      query: 'SELECT owner_id FROM rental_owner WHERE owner_id = ?',
      values: [owner_id],
    });

    if (!checkRows || checkRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'owner not found' },
        { status: 404 }
      );
    }

    // Handle business_profile_picture - store as base64 string (VARCHAR compatible)
    let businessProfilePictureValue = undefined;
    if (business_profile_picture) {
      if (business_profile_picture.startsWith('data:image')) {
        // Extract base64 data from data URL
        businessProfilePictureValue = business_profile_picture.split(',')[1];
      } else if (business_profile_picture !== null && business_profile_picture !== '') {
        // Use as is if it's already base64
        businessProfilePictureValue = business_profile_picture;
      }
    }

    // Prepare update query
    const updates = [];
    const values = [];

    if (first_name !== undefined) {
      updates.push('first_name = ?');
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push('last_name = ?');
      values.push(last_name);
    }
    if (contact_email !== undefined) {
      updates.push('contact_email = ?');
      values.push(contact_email);
    }
    if (contact_number !== undefined) {
      updates.push('contact_number = ?');
      values.push(contact_number);
    }
    if (business_name !== undefined) {
      updates.push('business_name = ?');
      values.push(business_name);
    }
    if (business_address !== undefined) {
      updates.push('business_address = ?');
      values.push(business_address);
    }
    if (business_description !== undefined) {
      updates.push('business_description = ?');
      values.push(business_description);
    }
    if (businessProfilePictureValue !== undefined) {
      updates.push('business_profile_picture = ?');
      values.push(businessProfilePictureValue);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'no fields to update' },
        { status: 400 }
      );
    }

    values.push(owner_id);

    const updateQuery = `UPDATE rental_owner SET ${updates.join(', ')} WHERE owner_id = ?`;
    await query({
      query: updateQuery,
      values: values,
    });

    // Fetch updated data
    const updatedRows = await query({
      query: 'SELECT * FROM rental_owner WHERE owner_id = ?',
      values: [owner_id],
    });

    const updatedProfile = updatedRows[0];
    
    // Handle business_profile_picture - if it's a string base64, add data URL prefix
    if (updatedProfile.business_profile_picture && typeof updatedProfile.business_profile_picture === 'string' && !updatedProfile.business_profile_picture.startsWith('data:')) {
      updatedProfile.business_profile_picture = `data:image/jpeg;base64,${updatedProfile.business_profile_picture}`;
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating owner profile settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { owner_id } = body;

    if (!owner_id) {
      return NextResponse.json(
        { success: false, error: 'missing owner_id' },
        { status: 400 }
      );
    }

    // Delete owner profile
    await query({
      query: 'DELETE FROM rental_owner WHERE owner_id = ?',
      values: [owner_id],
    });

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting owner profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
