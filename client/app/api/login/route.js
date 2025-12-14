import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ success: false, error: 'missing credentials' }, { status: 400 });

    const rows = await query({ query: 'SELECT customer_id, account_password FROM customer WHERE email = ?', values: [email] });
    if (!rows || rows.length === 0) return NextResponse.json({ success: false, error: 'invalid credentials' }, { status: 401 });

    const row = rows[0];
    const hashed = row.account_password;
    if (!hashed) return NextResponse.json({ success: false, error: 'invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, hashed);
    if (!ok) return NextResponse.json({ success: false, error: 'invalid credentials' }, { status: 401 });

    return NextResponse.json({ success: true, customer_id: row.customer_id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
