import { query } from "@/source/database.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customer_id,
      product_id,
      start_date,
      end_date,
      total_amount,
      payment_method,
      delivery_option,
    } = body;

    // Validate required fields
    if (
      !customer_id ||
      !product_id ||
      !start_date ||
      !end_date ||
      !total_amount
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    // Normalize payment method to match DB/check constraints if needed
    // Map "gcash" to "E-Wallet" for database storage
    let normalizedPaymentMethod = "Cash"; // Default
    if (payment_method) {
      const method = payment_method.toString().toLowerCase();
      if (method === "cash") {
        normalizedPaymentMethod = "Cash";
      } else if (method === "gcash") {
        normalizedPaymentMethod = "E-Wallet"; // Map Gcash to E-Wallet
      } else {
        normalizedPaymentMethod = payment_method;
      }
    }

    // Normalize delivery option for database storage
    let normalizedDeliveryOption = "Pick Up"; // Default
    if (delivery_option) {
      const option = delivery_option.toString().toLowerCase();
      if (option === "pickup" || option === "pick up") {
        normalizedDeliveryOption = "Pick Up";
      } else if (option === "lalamove") {
        normalizedDeliveryOption = "Lalamove";
      } else {
        normalizedDeliveryOption = delivery_option;
      }
    }

    // Insert booking into rentals table
    const result = await query({
      query: `
        INSERT INTO rentals 
        (customer_id, product_id, start_date, end_date, total_amount, status, delivery_option)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        customer_id,
        product_id,
        start_date,
        end_date,
        total_amount,
        "To ship",
        normalizedDeliveryOption,
      ],
    });

    const rentalId = result.insertId;

    // Always create a payment record with Pending status
    try {
      await query({
        query: `INSERT INTO payments (rental_id, payment_date, payment_method, amount_paid, payment_status) VALUES (?, NOW(), ?, ?, ?)`,
        values: [rentalId, normalizedPaymentMethod, total_amount, "Pending"],
      });
    } catch (e) {
      console.warn("Failed to insert payment record:", e.message || e);
      // continue even if payments insert fails
    }

    // Mark product as reserved (if advance booking or today) or rented (if in the past)
    try {
      const startDateObj = new Date(start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // If start_date is today or in the future, mark as Reserved; otherwise mark as Rented
      const status = startDateObj >= today ? "Reserved" : "Rented";

      await query({
        query:
          "UPDATE products SET availability_status = ? WHERE product_id = ?",
        values: [status, product_id],
      });
    } catch (e) {
      console.warn("Failed to update product availability:", e.message || e);
    }

    return NextResponse.json({
      success: true,
      rental_id: rentalId,
      message: "Booking confirmed successfully",
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
