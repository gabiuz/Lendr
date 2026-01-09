"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function OwnerBooking() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const filters = ["All", "Available", "Rented", "Reserved", "Unavailable"];

  // fetchBookings is used on mount and after state changes
  async function fetchBookings() {
    try {
      const ownerId = typeof window !== 'undefined' ? localStorage.getItem('owner_id') : null;
      if (!ownerId) return;

      const res = await fetch(`/api/owner-bookings?owner_id=${ownerId}`);
      try {
        const ct = res.headers.get("content-type") || "";
        if (res.ok && ct.includes("application/json")) {
          const data = await res.json();
          if (data.success) setBookings(data.bookings);
          else console.error("API returned success=false for owner-bookings", data);
        } else {
          const text = await res.text();
          console.error("Unexpected API response for /api/owner-bookings:", res.status, text);
        }
      } catch (err) {
        console.error('Failed to parse /api/owner-bookings response:', err);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.availability_status === activeFilter));
    }
  }, [activeFilter, bookings]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        links={[
          { href: "/owner-homepage", label: "Home" },
          { href: "/browse-rentals", label: "Browse Rentals" },
          { href: "/owner-booking", label: "Bookings" },
          { href: "/owner-payments", label: "Payments" },
        ]}
        showOwnerButton={false}
        profileInCircle={true}
        personalProfileHref="/homepage"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-16 md:mt-20 lg:mt-24 min-h-screen flex flex-col">
        {/* Breadcrumb */}
        <nav className="mb-4 md:mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-red-600">
                Home
              </Link>
            </li>
            <li>&gt;</li>
            <li className="text-black font-medium">Bookings / Transactions</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
            Bookings / Transactions
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Your products and their transaction status
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-colors ${
                activeFilter === filter
                  ? "bg-red-50 border-red-600 text-red-600"
                  : "bg-white border-gray-300 text-gray-700 hover:border-red-300"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
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
                    fill="#990000"
                  />
                  <path
                    d="M10.8083 1.38056L12.3417 4.44444H6.66944V0.888889H10.0139C10.35 0.888889 10.6583 1.07778 10.8083 1.38056ZM5.77778 0.888889V4.44444H1.09167L2.54444 1.39444C2.68889 1.08611 3.00278 0.888889 3.34444 0.888889H5.77778ZM12.8889 5.33333H14.2222C14.7139 5.33333 15.1111 5.73056 15.1111 6.22222V8C15.1111 8.43333 14.8028 8.79444 14.3917 8.87222C13.9833 8.08889 13.1667 7.55556 12.2222 7.55556C11.2722 7.55556 10.45 8.09722 10.0444 8.88889H5.95556C5.55 8.09722 4.72778 7.55556 3.77778 7.55556C2.83333 7.55556 2.01667 8.08889 1.60833 8.87222C1.19722 8.79444 0.888889 8.43333 0.888889 8V5.33333H12.8889ZM14.6528 9.725C15.425 9.53333 16 8.83333 16 8V6.22222C16 5.24167 15.2028 4.44444 14.2222 4.44444H13.3333L11.6028 0.983333C11.3 0.380555 10.6861 0 10.0111 0H3.34444C2.65833 0 2.03333 0.394444 1.73889 1.01389L0.258333 4.12222C0.0888889 4.48056 0 4.87222 0 5.26944V8C0 8.83333 0.575 9.53333 1.34722 9.725C1.33611 9.81389 1.33333 9.90556 1.33333 10C1.33333 11.35 2.42778 12.4444 3.77778 12.4444C5.12778 12.4444 6.22222 11.35 6.22222 10C6.22222 9.925 6.21944 9.85 6.21111 9.77778H9.78611C9.78056 9.85 9.775 9.925 9.775 10C9.775 11.35 10.8694 12.4444 12.2194 12.4444C13.5694 12.4444 14.6639 11.35 14.6639 10C14.6639 9.90833 14.6583 9.81667 14.65 9.725H14.6528ZM2.22222 10C2.22222 9.14167 2.91944 8.44444 3.77778 8.44444C4.63611 8.44444 5.33333 9.14167 5.33333 10C5.33333 10.8583 4.63611 11.5556 3.77778 11.5556C2.91944 11.5556 2.22222 10.8583 2.22222 10ZM12.2222 8.44444C13.0806 8.44444 13.7778 9.14167 13.7778 10C13.7778 10.8583 13.0806 11.5556 12.2222 11.5556C11.3639 11.5556 10.6667 10.8583 10.6667 10C10.6667 9.14167 11.3639 8.44444 12.2222 8.44444Z"
                    fill="#990000"
                  />
                </svg>
              </div>
              <span className="text-sm md:text-base font-medium">{filter}</span>
            </button>
          ))}
        </div>

        {/* Products Table */}
        <div className="bg-white border border-gray-200 shadow-lg overflow-hidden flex-1 overflow-y-auto">
          <div className="overflow-x-auto h-full">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                    Image
                  </th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                    Product ID
                  </th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                    Date / Duration
                  </th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.rental_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded flex items-center justify-center mx-auto overflow-hidden">
                          {booking.image_path ? (
                            <Image
                              src={booking.image_path}
                              alt={booking.product_name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-6 h-6 md:w-8 md:h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm md:text-base text-gray-900 text-center">
                        {booking.product_id}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link
                          href={`/product-description?product_id=${booking.product_id}`}
                          className="text-sm md:text-base hover:underline font-medium text-sky-800"
                        >
                          {booking.product_name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm md:text-base text-gray-900 text-center">
                        {booking.first_name} {booking.last_name}
                      </td>
                      <td className="px-4 py-4 text-sm md:text-base text-gray-900 text-center">
                        {new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({Math.ceil((new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24))} days)
                      </td>
                      <td className="px-4 py-4 text-sm md:text-base text-gray-900 text-center">
                        {booking.category_type || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm md:text-base font-semibold text-gray-900 text-center">
                        ₱{booking.total_amount}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {(() => {
                          const startDate = new Date(booking.start_date);
                          const today = new Date();
                          const isReserved = startDate > today;
                          const status = isReserved ? 'Reserved' : booking.availability_status;
                          return (
                            <span className={`text-xs md:text-sm font-semibold px-3 py-1 rounded-full ${
                              status === 'Available' ? 'bg-green-100 text-green-800' :
                              status === 'Rented' ? 'bg-blue-100 text-blue-800' :
                              status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {status}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-4 relative dropdown-container">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => setOpenDropdown(openDropdown === booking.rental_id ? null : booking.rental_id)}
                            className="text-red-600 hover:text-red-700 mx-auto block"
                          >
                            <Image
                              src="/icons/owner-booking/caret-down-duotone-light-full 1.svg"
                              alt="Action"
                              width={20}
                              height={20}
                              className="w-5 h-5"
                            />
                          </button>
                        </div>

                        {/* Dropdown Menu */}
                        {openDropdown === booking.rental_id && (
                          <div className="absolute right-4 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[280px]">
                            {/* For Pending Status - Show Approve/Decline */}
                            {booking.availability_status === 'Reserved' && (
                              <div className="p-6">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-3 gap-3 text-xs text-gray-700 border-b pb-4">
                                    <div>
                                      <div className="font-medium text-gray-500">Oct 10, 2025</div>
                                      <div className="font-semibold">₱600</div>
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-500">Oct 11, 2025</div>
                                      <div className="font-semibold">₱600</div>
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-500">Oct 12, 2025</div>
                                      <div className="font-semibold">₱600</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between text-sm border-b pb-3">
                                    <span className="text-gray-600">Sub Total</span>
                                    <span className="font-semibold">₱1,800</span>
                                  </div>
                                  
                                  <div className="flex justify-between text-sm border-b pb-3">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                  </div>
                                  
                                  <div className="flex justify-between text-base font-bold">
                                    <span>Total</span>
                                    <span className="text-blue-600">₱1,800</span>
                                  </div>
                                  
                                  <div className="flex gap-3 pt-2">
                                    <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                      Decline
                                    </button>
                                    <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-300 rounded-md cursor-not-allowed">
                                      Approve
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* For Ongoing Status - Show Status Tracker with some completed */}
                            {booking.availability_status === 'Rented' && (
                              <div className="p-6">
                                <div className="space-y-4">
                                  {/* Status Tracker */}
                                  <div className="relative pl-8">
                                    {/* Shipping - Completed */}
                                    <div className="relative pb-8">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-md"></div>
                                      <div className="absolute left-2 top-4 w-0.5 h-full bg-red-600"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Shipping</div>
                                        <div className="text-xs text-blue-600 font-medium">Completed</div>
                                      </div>
                                    </div>

                                    {/* Out for Delivery - Completed */}
                                    <div className="relative pb-8">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-md"></div>
                                      <div className="absolute left-2 top-4 w-0.5 h-full bg-red-600"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Out for Delivery</div>
                                        <div className="text-xs text-blue-600 font-medium">Completed</div>
                                      </div>
                                    </div>

                                    {/* Delivered - Completed */}
                                    <div className="relative pb-8">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-md"></div>
                                      <div className="absolute left-2 top-4 w-0.5 h-full bg-gray-300"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Delivered</div>
                                        <div className="text-xs text-blue-600 font-medium">Completed</div>
                                      </div>
                                    </div>

                                    {/* Return Shipped - Pending */}
                                    <div className="relative pb-8">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-white border-4 border-gray-300 shadow-md"></div>
                                      <div className="absolute left-2 top-4 w-0.5 h-full bg-gray-300"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Return Shipped</div>
                                        <div className="text-xs text-gray-400 font-medium">Pending</div>
                                      </div>
                                    </div>

                                    {/* Return Received - Pending */}
                                    <div className="relative">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-white border-4 border-gray-300 shadow-md"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Return Received</div>
                                        <div className="text-xs text-gray-400 font-medium">Pending</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* For Available/Completed Status - Show All Completed */}
                            {(booking.availability_status === 'Available' || booking.availability_status === 'Unavailable') && (
                              <div className="p-6">
                                <div className="space-y-4">
                                  {/* Status Tracker - All Completed */}
                                  <div className="relative pl-8">
                                    {/* Shipping - Completed */}
                                    <div className="relative pb-8">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-md"></div>
                                      <div className="absolute left-2 top-4 w-0.5 h-full bg-red-600"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Shipping</div>
                                        <div className="text-xs text-blue-600 font-medium">Completed</div>
                                      </div>
                                    </div>

                                    {/* Out for Delivery - Completed */}
                                    <div className="relative pb-8">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-md"></div>
                                      <div className="absolute left-2 top-4 w-0.5 h-full bg-red-600"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Out for Delivery</div>
                                        <div className="text-xs text-blue-600 font-medium">Completed</div>
                                      </div>
                                    </div>

                                    {/* Delivered - Completed */}
                                    <div className="relative pb-8">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-md"></div>
                                      <div className="absolute left-2 top-4 w-0.5 h-full bg-red-600"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Delivered</div>
                                        <div className="text-xs text-blue-600 font-medium">Completed</div>
                                      </div>
                                    </div>

                                    {/* Return Shipped - Completed */}
                                    <div className="relative pb-8">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-md"></div>
                                      <div className="absolute left-2 top-4 w-0.5 h-full bg-red-600"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Return Shipped</div>
                                        <div className="text-xs text-blue-600 font-medium">Completed</div>
                                      </div>
                                    </div>

                                    {/* Return Received - Completed */}
                                    <div className="relative">
                                      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-md"></div>
                                      <div className="pl-4">
                                        <div className="font-semibold text-sm text-gray-900">Return Received</div>
                                        <div className="text-xs text-blue-600 font-medium">Completed</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-600">
                      No products found with this status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}