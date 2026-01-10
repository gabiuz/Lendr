import { NextResponse } from 'next/server';
import { query } from '@/source/database.js';
import fs from 'fs';
import path from 'path';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner_id = searchParams.get('owner_id');

    let rows;
    if (owner_id) {
      rows = await query({
        query: `SELECT p.*, (SELECT image_path1 FROM products_image pi WHERE pi.product_id = p.product_id LIMIT 1) as image_path, c.category_type,
                ro.business_name, ro.business_address, ro.business_profile_picture as owner_avatar
                FROM products p
                LEFT JOIN categories c ON p.category_code = c.category_code
                LEFT JOIN rental_owner ro ON p.owner_id = ro.owner_id
                WHERE p.owner_id = ?`,
        values: [owner_id],
      });
    } else {
      rows = await query({
        query: `SELECT p.*, (SELECT image_path1 FROM products_image pi WHERE pi.product_id = p.product_id LIMIT 1) as image_path, c.category_type,
                ro.business_name, ro.business_address, ro.business_profile_picture as owner_avatar
                FROM products p
                LEFT JOIN categories c ON p.category_code = c.category_code
                LEFT JOIN rental_owner ro ON p.owner_id = ro.owner_id`,
      });
    }

    return NextResponse.json({ success: true, products: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const productName = formData.get('productName');
    const description = formData.get('description');
    const pricePerDay = formData.get('pricePerDay');
    const condition = formData.get('condition');
    const category = formData.get('category');
    const owner_id = formData.get('owner_id');
    const mainImage = formData.get('mainImage');
    
    // Collect thumbnail files
    const thumbnails = [];
    for (let i = 0; i < 5; i++) {
      const thumb = formData.get(`thumbnail_${i}`);
      if (thumb) thumbnails.push(thumb);
    }

    if (!owner_id) return NextResponse.json({ success: false, error: 'missing owner_id' }, { status: 400 });
    if (!productName || !pricePerDay) return NextResponse.json({ success: false, error: 'missing required fields' }, { status: 400 });

    // map category string to category_code (accept either a code or a friendly keyword)
    let categoryCode = null;
    if (category) {
      const catRows = await query({ query: 'SELECT category_code, category_type FROM categories' });
      const normalized = String(category).toLowerCase().trim();

      // if category looks like a numeric code, try exact match
      const asNum = Number(normalized);
      if (!Number.isNaN(asNum)) {
        const byCode = catRows.find((c) => Number(c.category_code) === asNum);
        if (byCode) categoryCode = byCode.category_code;
      }

      // otherwise try matching by type text (case-insensitive, partial match both ways)
      if (!categoryCode) {
        const found = catRows.find((c) => {
          const type = (c.category_type || '').toLowerCase();
          return (
            type === normalized ||
            type.includes(normalized) ||
            normalized.includes(type.split(' ')[0])
          );
        });
        if (found) categoryCode = found.category_code;
      }
    }

    // Insert product
    const insert = await query({
      query: 'INSERT INTO products (owner_id, category_code, product_name, description, product_rate, availability_status) VALUES (?, ?, ?, ?, ?, ?)',
      values: [owner_id, categoryCode, productName, description || null, pricePerDay, 'Available'],
    });
    const productId = insert.insertId;

    // Save images to public/pictures/products
    const publicDir = path.join(process.cwd(), 'public', 'pictures', 'products');
    ensureDir(publicDir);

    const savedPaths = [];
    
    // mainImage -> image_path1 (File object now)
    if (mainImage) {
      const buffer = await mainImage.arrayBuffer();
      const ext = mainImage.name.split('.').pop() || 'jpg';
      const filename = `prod_${productId}_main_${Date.now()}.${ext}`;
      const filepath = path.join(publicDir, filename);
      fs.writeFileSync(filepath, Buffer.from(buffer));
      const publicPath = `/pictures/products/${filename}`;
      savedPaths.push(publicPath);
    }

    // thumbnails array -> image_path2..image_path6 (max 5)
    for (let i = 0; i < Math.min(thumbnails.length, 5); i++) {
      const img = thumbnails[i];
      const buffer = await img.arrayBuffer();
      const ext = img.name.split('.').pop() || 'jpg';
      const filename = `prod_${productId}_thumb_${i}_${Date.now()}.${ext}`;
      const filepath = path.join(publicDir, filename);
      fs.writeFileSync(filepath, Buffer.from(buffer));
      const publicPath = `/pictures/products/${filename}`;
      savedPaths.push(publicPath);
    }

    // Insert a single row into products_image with image_path1..image_path6
    const imgVals = [productId];
    for (let i = 0; i < 6; i++) {
      imgVals.push(savedPaths[i] || null);
    }

    await query({
      query: 'INSERT INTO products_image (product_id, image_path1, image_path2, image_path3, image_path4, image_path5, image_path6) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values: imgVals,
    });

    return NextResponse.json({ success: true, productId, images: savedPaths });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
