import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let customer_id = searchParams.get('customer_id');
    if (!customer_id) return NextResponse.json({ success: false, error: 'missing customer_id' }, { status: 400 });

    // If an older client stored a string like 'cust12345', extract digits to support integer DB columns.
    if (typeof customer_id === 'string' && /\D/.test(customer_id)) {
      const digits = customer_id.replace(/\D/g, '');
      if (!digits) return NextResponse.json({ success: false, error: 'invalid customer_id' }, { status: 400 });
      customer_id = digits;
    }

    const rows = await query({ query: 'SELECT * FROM customer WHERE customer_id = ?', values: [customer_id] });
    if (!rows || rows.length === 0) return NextResponse.json({ success: false, error: 'not found' }, { status: 404 });

    // Normalize birthday to YYYY-MM-DD using local date components to avoid timezone shifts
    const profile = { ...rows[0] };
    // If profile_picture is stored as a Buffer (BLOB), convert to base64 data URL
    try {
      if (profile.profile_picture) {
        const p = profile.profile_picture;
        if (Buffer.isBuffer(p)) {
          const base64 = p.toString('base64');
          // assume jpeg by default; clients should handle variety if needed
          profile.profile_picture = `data:image/jpeg;base64,${base64}`;
        } else if (typeof p === 'string' && p.startsWith('\\x')) {
          // mysql may return hex escaped string; attempt to convert
          const hex = p.replace(/\\x/g, '');
          const buf = Buffer.from(hex, 'hex');
          profile.profile_picture = `data:image/jpeg;base64,${buf.toString('base64')}`;
        }
      }
    } catch (e) {
      // ignore image transform errors
    }
    try {
      const b = profile.birthday;
      if (b) {
        if (b instanceof Date) {
          const yyyy = b.getFullYear();
          const mm = String(b.getMonth() + 1).padStart(2, '0');
          const dd = String(b.getDate()).padStart(2, '0');
          profile.birthday = `${yyyy}-${mm}-${dd}`;
        } else if (typeof b === 'string') {
          // If the DB driver returned a full datetime string, parse and format using local values
          if (b.includes('T')) {
            const d = new Date(b);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            profile.birthday = `${yyyy}-${mm}-${dd}`;
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(b)) {
            // already YYYY-MM-DD
            profile.birthday = b;
          } else {
            // fallback: attempt Date parse
            const d = new Date(b);
            if (!isNaN(d)) {
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              profile.birthday = `${yyyy}-${mm}-${dd}`;
            }
          }
        }
      }
    } catch (e) {
      // ignore formatting errors and return raw value
    }

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    let { customer_id, ...fields } = body;
    if (!customer_id) return NextResponse.json({ success: false, error: 'missing customer_id' }, { status: 400 });

    if (typeof customer_id === 'string' && /\D/.test(customer_id)) {
      const digits = customer_id.replace(/\D/g, '');
      if (!digits) return NextResponse.json({ success: false, error: 'invalid customer_id' }, { status: 400 });
      customer_id = digits;
    }

    const allowed = ['first_name','middle_name','last_name','gender','birthday','email','phone_number','address','profile_picture'];
    const updates = [];
    const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        // handle profile_picture data URL -> Buffer conversion
        if (key === 'profile_picture' && typeof fields[key] === 'string' && fields[key].startsWith('data:')) {
          // data:[<mediatype>][;base64],<data>
          const matches = fields[key].match(/^data:(.+);base64,(.+)$/);
          if (matches) {
            const base64 = matches[2];
            const buf = Buffer.from(base64, 'base64');
            updates.push(`${key} = ?`);
            values.push(buf);
            continue;
          }
        }
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (updates.length === 0) return NextResponse.json({ success: false, error: 'no fields to update' }, { status: 400 });

    values.push(customer_id);
    const sql = `UPDATE customer SET ${updates.join(', ')} WHERE customer_id = ?`;
    // Attempt update, but if column `profile_picture` doesn't exist, create it and retry.
    let result;
    try {
      result = await query({ query: sql, values });
    } catch (err) {
      const msg = (err && err.message) || '';
      if (msg.toLowerCase().includes('unknown column') || (msg.toLowerCase().includes('column') && msg.toLowerCase().includes('unknown'))) {
        // Create profile_picture column as LONGBLOB to store image data
        try {
          await query({ query: "ALTER TABLE customer ADD COLUMN profile_picture LONGBLOB DEFAULT NULL" });
          result = await query({ query: sql, values });
        } catch (e) {
          throw e;
        }
      } else {
        throw err;
      }
    }

    // mysql2 returns an OkPacket for UPDATE; check affectedRows to ensure update occurred
    if (result && result.affectedRows !== undefined && result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'no rows updated' }, { status: 400 });
    }

    // return the updated profile
    const rows = await query({ query: 'SELECT * FROM customer WHERE customer_id = ?', values: [customer_id] });
    return NextResponse.json({ success: true, profile: rows && rows[0] ? rows[0] : null });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
