"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Footer from "../components/Footer";

export default function OwnerPayments() {
  const [activeFilter, setActiveFilter] = useState("received");

  // Sample payment data - this would come from an API in production
  const payments = [
    // Add sample payment data here when available
  ];

  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar
        links={[
          {
            href: "/owner-dashboard",
            label: "Home",
          },
          {
            href: "/browse-rentals",
            label: "Browse Rentals",
          },
          {
            href: "/owner-booking",
            label: "Bookings",
          },
          {
            href: "/owner-payments",
            label: "Payments",
          },
        ]}
        showOwnerButton={false}
        profileInCircle={true}
      />

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-20 xl:px-36 py-8 md:py-12 lg:mt-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <a href="/owner-dashboard" className="text-gray-600 hover:text-red-600 transition-colors">
            Home
          </a>
          <span className="text-gray-400">›</span>
          <a href="/owner-rentals" className="text-gray-600 hover:text-red-600 transition-colors">
            My Rentals
          </a>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900 font-medium">Edit Products</span>
        </div>

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
            Your Payments
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage your products, all in one place.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
          <button
            onClick={() => setActiveFilter("received")}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 transition-all text-sm md:text-base ${
              activeFilter === "received"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="bg-pink-100 p-2.5 rounded-full flex items-center justify-center">
              <svg
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M0.888885 5.33334V8C0.888885 8.43334 1.19722 8.79167 1.60833 8.87222C2.01666 8.08889 2.83333 7.55556 3.77777 7.55556C4.72777 7.55556 5.55 8.09722 5.95555 8.88889H10.0444C10.45 8.09722 11.2722 7.55556 12.2222 7.55556C13.1667 7.55556 13.9833 8.08889 14.3917 8.87222C14.8028 8.79167 15.1111 8.43334 15.1111 8V6.22222C15.1111 5.73056 14.7139 5.33334 14.2222 5.33334H0.888885Z"
                  fill={"#dc2626"}
                />
                <path
                  d="M10.8083 1.38056L12.3417 4.44444H6.66944V0.888889H10.0139C10.35 0.888889 10.6583 1.07778 10.8083 1.38056ZM5.77778 0.888889V4.44444H1.09167L2.54444 1.39444C2.68889 1.08611 3.00278 0.888889 3.34444 0.888889H5.77778ZM12.8889 5.33333H14.2222C14.7139 5.33333 15.1111 5.73056 15.1111 6.22222V8C15.1111 8.43333 14.8028 8.79444 14.3917 8.87222C13.9833 8.08889 13.1667 7.55556 12.2222 7.55556C11.2722 7.55556 10.45 8.09722 10.0444 8.88889H5.95556C5.55 8.09722 4.72778 7.55556 3.77778 7.55556C2.83333 7.55556 2.01667 8.08889 1.60833 8.87222C1.19722 8.79444 0.888889 8.43333 0.888889 8V5.33333H12.8889ZM14.6528 9.725C15.425 9.53333 16 8.83333 16 8V6.22222C16 5.24167 15.2028 4.44444 14.2222 4.44444H13.3333L11.6028 0.983333C11.3 0.380555 10.6861 0 10.0111 0H3.34444C2.65833 0 2.03333 0.394444 1.73889 1.01389L0.258333 4.12222C0.0888889 4.48056 0 4.87222 0 5.26944V8C0 8.83333 0.575 9.53333 1.34722 9.725C1.33611 9.81389 1.33333 9.90556 1.33333 10C1.33333 11.35 2.42778 12.4444 3.77778 12.4444C5.12778 12.4444 6.22222 11.35 6.22222 10C6.22222 9.925 6.21944 9.85 6.21111 9.77778H9.78611C9.78056 9.85 9.775 9.925 9.775 10C9.775 11.35 10.8694 12.4444 12.2194 12.4444C13.5694 12.4444 14.6639 11.35 14.6639 10C14.6639 9.90833 14.6583 9.81667 14.65 9.725H14.6528ZM2.22222 10C2.22222 9.14167 2.91944 8.44444 3.77778 8.44444C4.63611 8.44444 5.33333 9.14167 5.33333 10C5.33333 10.8583 4.63611 11.5556 3.77778 11.5556C2.91944 11.5556 2.22222 10.8583 2.22222 10ZM12.2222 8.44444C13.0806 8.44444 13.7778 9.14167 13.7778 10C13.7778 10.8583 13.0806 11.5556 12.2222 11.5556C11.3639 11.5556 10.6667 10.8583 10.6667 10C10.6667 9.14167 11.3639 8.44444 12.2222 8.44444Z"
                  fill={"#dc2626"}
                />
              </svg>
            </div>
            <span className="font-medium">Received</span>
          </button>

          <button
            onClick={() => setActiveFilter("pending")}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 transition-all text-sm md:text-base ${
              activeFilter === "pending"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="bg-pink-100 p-2.5 rounded-full flex items-center justify-center">
              <svg
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M0.888885 5.33334V8C0.888885 8.43334 1.19722 8.79167 1.60833 8.87222C2.01666 8.08889 2.83333 7.55556 3.77777 7.55556C4.72777 7.55556 5.55 8.09722 5.95555 8.88889H10.0444C10.45 8.09722 11.2722 7.55556 12.2222 7.55556C13.1667 7.55556 13.9833 8.08889 14.3917 8.87222C14.8028 8.79167 15.1111 8.43334 15.1111 8V6.22222C15.1111 5.73056 14.7139 5.33334 14.2222 5.33334H0.888885Z"
                  fill={"#dc2626"}
                />
                <path
                  d="M10.8083 1.38056L12.3417 4.44444H6.66944V0.888889H10.0139C10.35 0.888889 10.6583 1.07778 10.8083 1.38056ZM5.77778 0.888889V4.44444H1.09167L2.54444 1.39444C2.68889 1.08611 3.00278 0.888889 3.34444 0.888889H5.77778ZM12.8889 5.33333H14.2222C14.7139 5.33333 15.1111 5.73056 15.1111 6.22222V8C15.1111 8.43333 14.8028 8.79444 14.3917 8.87222C13.9833 8.08889 13.1667 7.55556 12.2222 7.55556C11.2722 7.55556 10.45 8.09722 10.0444 8.88889H5.95556C5.55 8.09722 4.72778 7.55556 3.77778 7.55556C2.83333 7.55556 2.01667 8.08889 1.60833 8.87222C1.19722 8.79444 0.888889 8.43333 0.888889 8V5.33333H12.8889ZM14.6528 9.725C15.425 9.53333 16 8.83333 16 8V6.22222C16 5.24167 15.2028 4.44444 14.2222 4.44444H13.3333L11.6028 0.983333C11.3 0.380555 10.6861 0 10.0111 0H3.34444C2.65833 0 2.03333 0.394444 1.73889 1.01389L0.258333 4.12222C0.0888889 4.48056 0 4.87222 0 5.26944V8C0 8.83333 0.575 9.53333 1.34722 9.725C1.33611 9.81389 1.33333 9.90556 1.33333 10C1.33333 11.35 2.42778 12.4444 3.77778 12.4444C5.12778 12.4444 6.22222 11.35 6.22222 10C6.22222 9.925 6.21944 9.85 6.21111 9.77778H9.78611C9.78056 9.85 9.775 9.925 9.775 10C9.775 11.35 10.8694 12.4444 12.2194 12.4444C13.5694 12.4444 14.6639 11.35 14.6639 10C14.6639 9.90833 14.6583 9.81667 14.65 9.725H14.6528ZM2.22222 10C2.22222 9.14167 2.91944 8.44444 3.77778 8.44444C4.63611 8.44444 5.33333 9.14167 5.33333 10C5.33333 10.8583 4.63611 11.5556 3.77778 11.5556C2.91944 11.5556 2.22222 10.8583 2.22222 10ZM12.2222 8.44444C13.0806 8.44444 13.7778 9.14167 13.7778 10C13.7778 10.8583 13.0806 11.5556 12.2222 11.5556C11.3639 11.5556 10.6667 10.8583 10.6667 10C10.6667 9.14167 11.3639 8.44444 12.2222 8.44444Z"
                  fill={"#dc2626"}
                />
              </svg>
            </div>
            <span className="font-medium">Pending</span>
          </button>
        </div>

        {/* Payments Table */}
        <div className="bg-white border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-100 border-b-2 border-gray-200">
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Image
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    ID
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Product Name
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Name
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Date
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Price
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Status
                  </th>
                  <th className="text-left py-3 md:py-4 px-3 md:px-6 font-bold text-black text-xs md:text-sm lg:text-base">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-12 md:py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-3 md:gap-4">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="md:w-16 md:h-16"
                        >
                          <path
                            d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 12C43.046 12 52 20.954 52 32C52 43.046 43.046 52 32 52C20.954 52 12 43.046 12 32C12 20.954 20.954 12 32 12ZM28 24V28H36V24H28ZM28 32V44H36V32H28Z"
                            fill="#d1d5db"
                          />
                        </svg>
                        <p className="text-base md:text-lg font-medium">No payments yet</p>
                        <p className="text-xs md:text-sm">
                          Your payment history will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments
                    .filter((payment) => payment.status.toLowerCase() === activeFilter)
                    .map((payment, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 md:py-4 px-3 md:px-6">
                          <Image
                            src={payment.image}
                            alt={payment.productName}
                            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg"
                          />
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-gray-800 text-xs md:text-sm">
                          {payment.id}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-sky-800 font-medium text-xs md:text-sm">
                          {payment.productName}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-gray-800 text-xs md:text-sm">
                          {payment.customerName}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-gray-800 text-xs md:text-sm">
                          {payment.date}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-gray-800 font-semibold text-xs md:text-sm">
                          {payment.price}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6">
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap ${
                              payment.status.toLowerCase() === "received"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6">
                          <button className="text-red-600 hover:text-red-700 font-medium transition-colors text-xs md:text-sm whitespace-nowrap">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}