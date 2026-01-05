import { NextResponse } from 'next/server';
import { query } from '../../../source/database.js';
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
        query: `SELECT p.*, (SELECT image_path1 FROM product_image pi WHERE pi.product_id = p.product_id LIMIT 1) as image_path, c.category_type
                FROM products p
                LEFT JOIN categories c ON p.category_code = c.category_code
                WHERE p.owner_id = ?`,
        values: [owner_id],
      });
    } else {
      rows = await query({
        query: `SELECT p.*, (SELECT image_path1 FROM product_image pi WHERE pi.product_id = p.product_id LIMIT 1) as image_path, c.category_type
                FROM products p
                LEFT JOIN categories c ON p.category_code = c.category_code`,
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
    const body = await request.json();
    const { productName, description, pricePerDay, location, condition, category, owner_id, mainImage, thumbnails = [] } = body;

    if (!owner_id) return NextResponse.json({ success: false, error: 'missing owner_id' }, { status: 400 });
    if (!productName || !pricePerDay) return NextResponse.json({ success: false, error: 'missing required fields' }, { status: 400 });

    // map category string to category_code
    let categoryCode = null;
    if (category) {
      // try to find matching category by type
      const catRows = await query({ query: 'SELECT category_code, category_type FROM categories' });
      const found = catRows.find((c) => c.category_type.toLowerCase().includes(category.toLowerCase()));
      if (found) categoryCode = found.category_code;
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
    // mainImage -> image_path1
    if (mainImage) {
      const match = mainImage.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.*)$/);
      const ext = match && match[2] ? match[2] : 'jpg';
      const data = match ? match[3] : mainImage.split(',')[1] || mainImage;
      const filename = `prod_${productId}_main_${Date.now()}.${ext}`;
      const filepath = path.join(publicDir, filename);
      fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
      const publicPath = `/pictures/products/${filename}`;
      savedPaths.push(publicPath);
    }

    // thumbnails array -> image_path2..image_path6 (max 5)
    for (let i = 0; i < Math.min(thumbnails.length, 5); i++) {
      const img = thumbnails[i];
      const match = img.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.*)$/);
      const ext = match && match[2] ? match[2] : 'jpg';
      const data = match ? match[3] : img.split(',')[1] || img;
      const filename = `prod_${productId}_thumb_${i}_${Date.now()}.${ext}`;
      const filepath = path.join(publicDir, filename);
      fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
      const publicPath = `/pictures/products/${filename}`;
      savedPaths.push(publicPath);
    }

    // Insert a single row into product_image with image_path1..image_path6
    const imgVals = [productId];
    for (let i = 0; i < 6; i++) {
      imgVals.push(savedPaths[i] || null);
    }

    await query({
      query: 'INSERT INTO product_image (product_id, image_path1, image_path2, image_path3, image_path4, image_path5, image_path6) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values: imgVals,
    });

    return NextResponse.json({ success: true, productId, images: savedPaths });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
