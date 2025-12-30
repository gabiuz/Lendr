import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      first_name,
      middle_name,
      last_name,
      contact_email,
      contact_number,
      business_name,
      business_address,
      postal_code,
    } = body;

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

    const sql = `INSERT INTO rental_owner (owner_id, first_name, middle_name, last_name, contact_email, contact_number, business_name, business_address, postal_code, registration_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      owner_id,
      first_name,
      middle_name || null,
      last_name,
      contact_email,
      contact_number,
      business_name,
      business_address,
      postal_code || null,
      registration_date,
    ];

    await query({ query: sql, values });

    // Ensure the business email exists in the customer table so owner-login
    // can validate password against the customer's account password.
    const custRows = await query({ query: 'SELECT customer_id FROM customer WHERE email = ?', values: [contact_email] });
    if (!custRows || custRows.length === 0) {
      // create a minimal customer record using owner info
      const allCust = await query({ query: 'SELECT customer_id FROM customer' });
      let maxCust = 0;
      for (const row of allCust) {
        const raw = String(row.customer_id || '');
        const digits = raw.replace(/\D/g, '');
        const n = digits ? parseInt(digits, 10) : NaN;
        if (!isNaN(n) && n > maxCust) maxCust = n;
      }
      const customer_id = maxCust + 1 || 1;
      const date_account_made = registration_date;

      const gender = 'other';
      const birthday = '1970-01-01';
      const phone_number = contact_number || '';
      const address = business_address || '';

      const custSql = `INSERT INTO customer (customer_id, first_name, middle_name, last_name, gender, birthday, email, phone_number, address, account_password, date_account_made)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const custValues = [
        customer_id,
        first_name,
        middle_name || null,
        last_name,
        gender,
        birthday,
        contact_email,
        phone_number,
        address,
        null,
        date_account_made,
      ];

      await query({ query: custSql, values: custValues });
    }

    return NextResponse.json({ success: true, owner_id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
