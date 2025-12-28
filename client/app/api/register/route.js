import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      first_name,
      middle_name,
      last_name,
      gender,
      birthday,
      email,
      phone_number,
      address,
      password,
    } = body;

    // Determine next numeric customer_id by taking the max numeric portion and adding 1.
    // This keeps IDs sequential: 1,2,3,... regardless of the DB column type.
    const all = await query({ query: 'SELECT customer_id FROM customer' });
    let max = 0;
    for (const row of all) {
      const raw = String(row.customer_id || '');
      const digits = raw.replace(/\D/g, '');
      const n = digits ? parseInt(digits, 10) : NaN;
      if (!isNaN(n) && n > max) max = n;
    }
    const customer_id = max + 1 || 1;
    const date_account_made = new Date().toISOString().split('T')[0];

    // hash password before storing
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // include password column (account_password) if DB requires it
    const sql = `INSERT INTO customer (customer_id, first_name, middle_name, last_name, gender, birthday, email, phone_number, address, account_password, date_account_made)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      customer_id,
      first_name,
      middle_name || null,
      last_name,
      gender,
      birthday,
      email,
      phone_number,
      address,
      hashedPassword || null,
      date_account_made,
    ];

    await query({ query: sql, values });

    return NextResponse.json({ success: true, customer_id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
