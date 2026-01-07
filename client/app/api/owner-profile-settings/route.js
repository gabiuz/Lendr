import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';
import fs from 'fs';
import path from 'path';

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
    
    // Normalize business_profile_picture: leave public paths and data URLs as-is,
    // convert raw base64 (if present) to a data URL so the client can render it.
    if (ownerData.business_profile_picture && typeof ownerData.business_profile_picture === 'string') {
      const v = ownerData.business_profile_picture;
      if (v.startsWith('/') || v.startsWith('http')) {
        // assume public path or external URL — keep as-is
      } else if (v.startsWith('data:')) {
        // already a data URL — keep as-is
      } else if (/^[A-Za-z0-9+/=\s]+$/.test(v) && v.length > 100) {
        // likely a base64 blob without data: prefix — convert to data URL
        ownerData.business_profile_picture = `data:image/jpeg;base64,${v}`;
      }
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

    // Handle business_profile_picture: accept a public path, data URL, or base64.
    // Prefer saving files to disk and storing a public path to avoid DB overflow.
    let businessProfilePictureValue = undefined;
    if (business_profile_picture !== undefined) {
      try {
        // If it's a public path or external URL, store it directly
        if (typeof business_profile_picture === 'string' && (business_profile_picture.startsWith('/') || business_profile_picture.startsWith('http'))) {
          businessProfilePictureValue = business_profile_picture;
        } else {
          // Attempt to parse data URL or raw base64 and save to disk
          let base64 = null;
          let ext = 'jpg';
          if (typeof business_profile_picture === 'string' && business_profile_picture.startsWith('data:')) {
            const m = business_profile_picture.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
            if (m) {
              const mime = m[1];
              base64 = m[2];
              ext = mime.split('/')[1] || 'jpg';
            } else {
              const parts = business_profile_picture.split(',');
              base64 = parts[1] || parts[0];
            }
          } else if (typeof business_profile_picture === 'string') {
            // raw base64
            base64 = business_profile_picture;
          }

          if (base64 && base64.length > 50) {
            const buffer = Buffer.from(base64, 'base64');
            const dir = path.join(process.cwd(), 'public', 'pictures', 'owners');
            fs.mkdirSync(dir, { recursive: true });
            const filename = `${owner_id}_${Date.now()}.${ext}`;
            const filePath = path.join(dir, filename);
            fs.writeFileSync(filePath, buffer);
            businessProfilePictureValue = `/pictures/owners/${filename}`;
          }
        }
      } catch (e) {
        businessProfilePictureValue = undefined;
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
    
    // Normalize updated business_profile_picture similar to GET above
    if (updatedProfile.business_profile_picture && typeof updatedProfile.business_profile_picture === 'string') {
      const v = updatedProfile.business_profile_picture;
      if (v.startsWith('/') || v.startsWith('http')) {
        // keep as-is
      } else if (v.startsWith('data:')) {
        // keep as-is
      } else if (/^[A-Za-z0-9+/=\s]+$/.test(v) && v.length > 100) {
        updatedProfile.business_profile_picture = `data:image/jpeg;base64,${v}`;
      }
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

    // Get the customer_id associated with this owner
    const ownerRows = await query({
      query: 'SELECT customer_id FROM rental_owner WHERE owner_id = ?',
      values: [owner_id],
    });

    const customer_id = ownerRows.length > 0 ? ownerRows[0].customer_id : null;

    // Get all products owned by this owner
    const products = await query({
      query: 'SELECT product_id FROM products WHERE owner_id = ?',
      values: [owner_id],
    });

    const productIds = products.map(p => p.product_id);

    // Delete business records (cascade deletion in order to avoid foreign key constraints)
    
    // 1. Delete payments associated with rentals of this owner's products
    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      await query({
        query: `DELETE FROM payments WHERE rental_id IN 
                (SELECT rental_id FROM rentals WHERE product_id IN (${placeholders}))`,
        values: productIds,
      });

      // 2. Delete reviews associated with this owner's products
      await query({
        query: `DELETE FROM reviews WHERE product_id IN (${placeholders})`,
        values: productIds,
      });

      // 3. Delete rentals associated with this owner's products
      await query({
        query: `DELETE FROM rentals WHERE product_id IN (${placeholders})`,
        values: productIds,
      });

      // 4. Delete product images associated with this owner's products
      await query({
        query: `DELETE FROM products_image WHERE product_id IN (${placeholders})`,
        values: productIds,
      });

      // 5. Delete the products themselves
      await query({
        query: `DELETE FROM products WHERE owner_id = ?`,
        values: [owner_id],
      });
    }

    // 6. Unlink the customer account from the owner profile before deletion
    await query({
      query: 'UPDATE customer SET owner_id = NULL WHERE owner_id = ?',
      values: [owner_id],
    });

    // 7. Delete owner profile (but NOT the customer account)
    await query({
      query: 'DELETE FROM rental_owner WHERE owner_id = ?',
      values: [owner_id],
    });

    return NextResponse.json({
      success: true,
      message: 'Owner profile and all associated business records deleted successfully. Personal account has been preserved.',
    });
  } catch (error) {
    console.error('Error deleting owner profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
