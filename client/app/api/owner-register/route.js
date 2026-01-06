import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customer_id: providedCustomerId,
      contact_email,
      contact_number,
      business_name,
      business_address,
      postal_code,
      business_profile_picture,
    } = body;

    let customer_id = providedCustomerId;

    // If no customer_id provided, find or create a customer based on email
    if (!customer_id) {
      let custRows = await query({ query: 'SELECT customer_id FROM customer WHERE email = ?', values: [contact_email] });
      
      if (!custRows || custRows.length === 0) {
        // create a minimal customer record using business info
        const allCust = await query({ query: 'SELECT customer_id FROM customer' });
        let maxCust = 0;
        for (const row of allCust) {
          const raw = String(row.customer_id || '');
          const digits = raw.replace(/\D/g, '');
          const n = digits ? parseInt(digits, 10) : NaN;
          if (!isNaN(n) && n > maxCust) maxCust = n;
        }
        customer_id = maxCust + 1 || 1;
        const date_account_made = new Date().toISOString().split('T')[0];

        const gender = 'other';
        const birthday = '1970-01-01';
        const phone_number = contact_number || '';
        const address = business_address || '';

        const custSql = `INSERT INTO customer (customer_id, gender, birthday, email, phone_number, address, date_account_made, user_profile_picture)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const custValues = [
          customer_id,
          gender,
          birthday,
          contact_email,
          phone_number,
          address,
          date_account_made,
          null,
        ];

        let custRetries = 0;
        let custSuccess = false;
        while (custRetries < 10 && !custSuccess) {
          try {
            await query({ query: custSql, values: custValues });
            custSuccess = true;
          } catch (e) {
            const msg = (e && e.message) || '';
            const match = msg.match(/Unknown column '([^']+)'/i);
            if (match) {
              const col = match[1];
              try {
                await query({ query: `ALTER TABLE customer ADD COLUMN \`${col}\` VARCHAR(255) DEFAULT NULL` });
              } catch (err2) {
                // ignore
              }
              custRetries++;
            } else {
              throw e;
            }
          }
        }
        if (!custSuccess) {
          throw new Error('Failed to insert customer after 10 column creation attempts');
        }
      } else {
        customer_id = custRows[0].customer_id;
      }
    }

    // Determine next numeric owner_id by taking the max numeric portion and adding 1.
    const all = await query({ query: 'SELECT owner_id FROM rental_owner' });
    let max = 0;
    for (const row of all) {
      const raw = String(row.owner_id || '');
      const digits = raw.replace(/\D/g, '');
      const n = digits ? parseInt(digits, 10) : NaN;
      if (!isNaN(n) && n > max) max = n;
    }
    const owner_id = (max + 1).toString();
    const registration_date = new Date().toISOString().split('T')[0];

    // If a business profile picture was provided as a data URL or base64 string,
    // save it to disk under public/pictures/owners and store the public path in DB.
    let businessProfilePath = null;
    if (business_profile_picture) {
      try {
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
          base64 = business_profile_picture;
        }

        if (base64) {
          const buffer = Buffer.from(base64, 'base64');
          const dir = path.join(process.cwd(), 'public', 'pictures', 'owners');
          fs.mkdirSync(dir, { recursive: true });
          const filename = `${owner_id}_${Date.now()}.${ext}`;
          const filePath = path.join(dir, filename);
          fs.writeFileSync(filePath, buffer);
          businessProfilePath = `/pictures/owners/${filename}`;
        }
      } catch (e) {
        businessProfilePath = null;
      }
    }

    const sql = `INSERT INTO rental_owner (owner_id, customer_id, contact_email, contact_number, business_name, business_address, postal_code, registration_date, business_profile_picture)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      owner_id,
      customer_id,
      contact_email,
      contact_number,
      business_name,
      business_address,
      postal_code || null,
      registration_date,
      businessProfilePath || null,
    ];

    let retries = 0;
    let success = false;
    while (retries < 10 && !success) {
      try {
        await query({ query: sql, values });
        success = true;
      } catch (e) {
        const msg = (e && e.message) || '';
        const match = msg.match(/Unknown column '([^']+)'/i);
        if (match) {
          const col = match[1];
          try {
            await query({ query: `ALTER TABLE rental_owner ADD COLUMN \`${col}\` VARCHAR(255) DEFAULT NULL` });
          } catch (err2) {
            // ignore alter errors
          }
          retries++;
        } else {
          throw e;
        }
      }
    }
    if (!success) {
      throw new Error('Failed to insert after 10 column creation attempts');
    }

    // Update customer's owner_id to link bidirectionally
    await query({ query: 'UPDATE customer SET owner_id = ? WHERE customer_id = ?', values: [owner_id, customer_id] });

    return NextResponse.json({ success: true, owner_id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
