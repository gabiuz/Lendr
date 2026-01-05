"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OwnerProfile() {
  const router = useRouter();
  const [ownerData, setOwnerData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [profileStats, setProfileStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOwnerData() {
      try {
        const owner_id = localStorage.getItem('owner_id');
        if (!owner_id) {
          console.error('No owner_id found');
          setLoading(false);
          return;
        }

        // Fetch owner data
        const ownerRes = await fetch(`/api/owner-profile?owner_id=${owner_id}`);
        const ownerResult = await ownerRes.json();
        if (ownerResult.success && ownerResult.data) {
          setOwnerData(ownerResult.data);
          
          // Use customer data from the API response if available, otherwise fetch it separately
          if (ownerResult.customer) {
            setCustomerData(ownerResult.customer);
          } else if (ownerResult.data.customer_id) {
            const customerRes = await fetch(`/api/profile?customer_id=${ownerResult.data.customer_id}`);
            const customerResult = await customerRes.json();
            if (customerResult.success && customerResult.profile) {
              setCustomerData(customerResult.profile);
            }
          }
        }

        // Fetch profile stats
        const statsRes = await fetch(`/api/owner-profile-stats?owner_id=${owner_id}`);
        const statsResult = await statsRes.json();
        if (statsResult.success) {
          setProfileStats(statsResult.stats);
        }
      } catch (error) {
        console.error('Error fetching owner data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOwnerData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        links={[
          { href: "/owner-homepage", label: "Home" },
          { href: "/browse-rentals", label: "Browse Rentals" },
          { href: "/owner-booking", label: "Bookings" },
          { href: "/payments", label: "Payments" },
        ]}
        showOwnerButton={false}
        profileInCircle={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 mt-16 md:mt-20 lg:mt-24">
        {/* Profile Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8 mb-8 relative">
          {/* Edit Button - Top Right */}
          <button 
            onClick={() => router.push('/owner-profile-settings')}
            className="cursor-pointer absolute top-4 right-4 bg-black text-white p-2 rounded-full hover:bg-gray-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Profile Image */}
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden bg-gray-200">
                {ownerData?.business_profile_picture ? (
                  // Use regular img to support data URLs
                  <img
                    src={ownerData.business_profile_picture}
                    alt="Business Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300"></div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start gap-2 mb-2">
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(profileStats?.customerRating ?? 0) ? 'fill-current' : 'fill-current opacity-30'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold">{profileStats?.customerRating ?? '—'}</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-1">
                {customerData?.first_name && customerData?.last_name 
                  ? `${customerData.first_name} ${customerData.last_name}`
                  : 'Rental Owner Name'}
              </h1>
              <p className="text-gray-600 mb-1">
                {customerData?.address ? customerData.address.split(',')[0].trim() : 'Los Angeles, CA'}
              </p>
              <p className="text-red-600 font-semibold mb-4">
                {ownerData?.business_name ? `${ownerData.business_name} Rental Owner` : 'Rental Owner'}
              </p>

              <p className="text-sm md:text-base text-gray-700 mb-6 max-w-2xl">
                {ownerData?.business_description 
                  ? ownerData.business_description
                  : 'No business description available yet.'}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-700">{ownerData?.contact_number || '09123456789'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700">{ownerData?.contact_email || 'owner@gmail.com'}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-6 justify-center items-center md:items-end">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 flex items-center justify-center shrink-0">
                  <svg
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16"
                    width="1000"
                    height="1000"
                    viewBox="0 0 202 202"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M151.5 45.45C154.278 45.45 156.55 47.7225 156.55 50.5V151.5C156.55 154.278 154.278 156.55 151.5 156.55H50.5C47.7225 156.55 45.45 154.278 45.45 151.5V50.5C45.45 47.7225 47.7225 45.45 50.5 45.45H151.5ZM50.5 30.3C39.3585 30.3 30.3 39.3585 30.3 50.5V151.5C30.3 162.642 39.3585 171.7 50.5 171.7H151.5C162.642 171.7 171.7 162.642 171.7 151.5V50.5C171.7 39.3585 162.642 30.3 151.5 30.3H50.5ZM65.65 136.35C65.65 139.128 67.9225 141.4 70.7 141.4H131.3C134.078 141.4 136.35 139.128 136.35 136.35C136.35 122.399 125.051 111.1 111.1 111.1H90.9C76.9494 111.1 65.65 122.399 65.65 136.35ZM101 98.475C110.753 98.475 118.675 90.5529 118.675 80.8C118.675 71.0472 110.753 63.125 101 63.125C91.2472 63.125 83.325 71.0472 83.325 80.8C83.325 90.5529 91.2472 98.475 101 98.475Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold text-black">
                    {profileStats?.products ?? '0'}
                  </p>
                  <p className="text-sm md:text-base lg:text-sm text-gray-600">Products</p>
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-px h-16 md:h-20 bg-black mx-4"></div>

              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 flex items-center justify-center shrink-0">
                  <svg
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-16 lg:h-16"
                    width="1000"
                    height="1000"
                    viewBox="0 0 202 202"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M151.5 45.45C154.278 45.45 156.55 47.7225 156.55 50.5V151.5C156.55 154.278 154.278 156.55 151.5 156.55H50.5C47.7225 156.55 45.45 154.278 45.45 151.5V50.5C45.45 47.7225 47.7225 45.45 50.5 45.45H151.5ZM50.5 30.3C39.3585 30.3 30.3 39.3585 30.3 50.5V151.5C30.3 162.642 39.3585 171.7 50.5 171.7H151.5C162.642 171.7 171.7 162.642 171.7 151.5V50.5C171.7 39.3585 162.642 30.3 151.5 30.3H50.5ZM65.65 136.35C65.65 139.128 67.9225 141.4 70.7 141.4H131.3C134.078 141.4 136.35 139.128 136.35 136.35C136.35 122.399 125.051 111.1 111.1 111.1H90.9C76.9494 111.1 65.65 122.399 65.65 136.35ZM101 98.475C110.753 98.475 118.675 90.5529 118.675 80.8C118.675 71.0472 110.753 63.125 101 63.125C91.2472 63.125 83.325 71.0472 83.325 80.8C83.325 90.5529 91.2472 98.475 101 98.475Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold text-black">
                    {profileStats?.activeRentals ?? '0'}
                  </p>
                  <p className="text-sm md:text-base lg:text-sm text-gray-600">Rentals</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Top Earning Product */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 md:p-6">
            <h3 className="text-xs md:text-sm text-gray-600 mb-2">Top Earning Product</h3>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-3 md:mb-4">
              {profileStats?.topEarningProduct?.name || 'No data'}
            </h2>
            <div className="text-right">
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                ₱{profileStats?.topEarningProduct?.earnings ? Number(profileStats.topEarningProduct.earnings).toLocaleString() : '0'}
              </p>
              <p className="text-sm md:text-base text-gray-600">this month</p>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 md:p-6">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <h3 className="text-xs md:text-sm text-gray-600">Monthly Revenue</h3>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-black">
                ₱{profileStats?.currentMonthRevenue ? Number(profileStats.currentMonthRevenue).toLocaleString() : '0'}
              </p>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {profileStats?.monthlyRevenue ? 
                profileStats.monthlyRevenue.map((value, i) => {
                  const maxValue = Math.max(...profileStats.monthlyRevenue, 1);
                  const height = (value / maxValue) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 rounded-t transition-colors"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`₱${Number(value).toLocaleString()}`}
                    ></div>
                  );
                })
              : [40, 50, 55, 65, 70, 60, 75, 95, 70, 65, 70, 75].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gray-300 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
            </div>
            <div className="flex justify-around text-xs text-gray-500 mt-2 gap-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Most Rented Category */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm md:text-base text-gray-600 mb-4">Most Rented Category</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1e40af"
                    strokeWidth="20"
                    strokeDasharray={profileStats?.categoryBreakdown?.length ? `${(profileStats.mostRentedCategory?.count / profileStats.categoryBreakdown.reduce((sum, cat) => sum + (cat.product_count || 0), 0)) * 251.2}` : '251.2'}
                    strokeDashoffset={profileStats?.categoryBreakdown?.length ? `${251.2 - ((profileStats.mostRentedCategory?.count / profileStats.categoryBreakdown.reduce((sum, cat) => sum + (cat.product_count || 0), 0)) * 251.2) / 2}` : '41.87'}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-600">Your</p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
              </div>
              <div>
                <div className="bg-black text-white px-3 md:px-4 py-2 rounded-lg mb-3 md:mb-4">
                  <p className="text-xl md:text-2xl font-bold">{profileStats?.mostRentedCategory?.count || '0'} {profileStats?.mostRentedCategory?.name || 'Items'}</p>
                </div>
                <div className="space-y-2 text-xs md:text-sm">
                  {profileStats?.categoryBreakdown?.length ? profileStats.categoryBreakdown.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                      <span>{cat.product_count} {cat.category_type}</span>
                    </div>
                  )) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                        <span>No data</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Ratings */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-black">Customer Ratings</h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(profileStats?.customerRating ?? 0) ? 'fill-current' : 'fill-current opacity-30'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-3xl md:text-4xl font-bold text-black">{profileStats?.customerRating ?? '—'}</span>
              </div>
            </div>
            <div className="h-48 relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 150"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 150 L 0 100 Q 50 80, 100 70 T 200 50 T 300 55 L 400 45 L 400 150 Z"
                  fill="#1e40af"
                  stroke="none"
                />
                <path
                  d="M 0 100 Q 50 80, 100 70 T 200 50 T 300 55 T 400 45"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
