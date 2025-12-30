"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OwnerDashboard() {
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const tips = [
    "Listing with clear photos and detailed descriptions get 3x more bookings!",
    "Adding multiple angles of your item builds renter trust instantly!",
    "Verified owners receeive more booking requests than unverified ones.",
    "Responding withing 10 minutes increases your approval rate by 40%!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [tips.length]);
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
            href: "/bookings",
            label: "Bookings",
          },
          {
            href: "/payments",
            label: "Payments",
          },
        ]}
        showOwnerButton={false}
        profileInCircle={true}
      />
      {/* image hero section */}
      <header className="bg-[url('/owner-dashboard-image.jpg')] bg-cover bg-center h-[500px] md:h-[600px] xl:h-[766px]">
        <div className="flex flex-col items-center justify-center gap-9 md:gap-6 text-center px-4 h-full">
          <h1 className="text-white font-bold text-3xl md:text-4xl xl:text-7xl">
            Turn Your Items Into <span className="text-red">Income</span>
          </h1>
          <p className="text-white font-medium text-sm md:text-base xl:text-xl max-w-2xl">
            List your unused items and start earning safely and conveniently.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full cursor-pointer text-sm md:text-base xl:text-lg transition-colors whitespace-nowrap">
            + Add your first product
          </button>
        </div>
      </header>
      <div className="overview-container mt-20 px-4 md:px-8 lg:px-20 xl:px-36 mb-20">
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center">
            Overview
          </h2>
          {/* Overview Cards */}
          <div className="overview-card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Products Card */}
            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="">
                <svg
                  width="202"
                  height="202"
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
              <div className="flex flex-col items-center gap-2.5">
                <h3 className="text-3xl font-bold text-black">10</h3>
                <p className="text-gray-600 font-medium">Products</p>
              </div>
            </div>

            {/* Active Rentals Card */}
            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="">
                <svg
                  width="202"
                  height="202"
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
              <div className="flex flex-col items-center gap-2.5">
                <h3 className="text-3xl font-bold text-black">5</h3>
                <p className="text-gray-600 font-medium">Active Rentals</p>
              </div>
            </div>

            {/* Total Earnings Card */}
            <div className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="">
                <svg
                  width="202"
                  height="202"
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
              <div className="flex flex-col items-center gap-2.5">
                <h3 className="text-3xl font-bold text-black">₱8,450</h3>
                <p className="text-gray-600 font-medium">Total Earnings</p>
              </div>
            </div>

            {/* Rating Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="">
                <svg
                  width="202"
                  height="202"
                  viewBox="0 0 202 202"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M94.2176 36.4737C96.7269 30.5088 105.273 30.5088 107.783 36.4737L122.593 71.6799C123.651 74.1946 126.043 75.9128 128.789 76.1304L167.231 79.1775C173.744 79.6938 176.385 87.7302 171.423 91.933L142.134 116.738C140.042 118.51 139.128 121.291 139.767 123.94L148.716 161.029C150.231 167.313 143.318 172.28 137.741 168.913L104.829 149.037C102.478 147.617 99.5219 147.617 97.1712 149.037L64.2591 168.913C58.6828 172.28 51.7685 167.313 53.2846 161.029L62.2329 123.94C62.872 121.291 61.9584 118.51 59.8664 116.738L30.5774 91.933C25.615 87.7302 28.256 79.6938 34.7692 79.1775L73.2116 76.1304C75.9575 75.9128 78.3494 74.1946 79.4072 71.6799L94.2176 36.4737Z"
                    fill="black"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <h3 className="text-3xl font-bold text-black">4.8</h3>
                <p className="text-gray-600 font-medium">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rentals-container">
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center">
            My Rentals
          </h2>
        </div>
        <div className="rentals-card px-4 md:px-8 lg:px-20 xl:px-36 mb-20 xl:mt-16">
          <div className="flex flex-col shadow-lg rounded-2xl overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-neutral-200">
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Products
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Customer
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Dates
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Total
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-black">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-200 transition-colors">
                  <td className="py-4 px-4 text-center text-sky-800">Toyota Vios</td>
                  <td className="py-4 px-4 text-center text-gray-800">Kenneth Morales</td>
                  <td className="py-4 px-4 text-center text-gray-800">Oct 10 - 12</td>
                  <td className="py-4 px-4 text-center text-gray-800">₱3,000</td>
                  <td className="py-4 px-4 text-center">
                    <span className=" text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Ongoing
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-200 transition-colors">
                  <td className="py-4 px-4 text-center text-sky-800">Power Drill</td>
                  <td className="py-4 px-4 text-center text-gray-800">Ali Gatmaitan</td>
                  <td className="py-4 px-4 text-center text-gray-800">Oct 10 - 12</td>
                  <td className="py-4 px-4 text-center text-gray-800">₱199</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-200 transition-colors">
                  <td className="py-4 px-4 text-center text-sky-800">Nikon D5600</td>
                  <td className="py-4 px-4 text-center text-gray-800">Jay Roland</td>
                  <td className="py-4 px-4 text-center text-gray-800">Oct 10 - 12</td>
                  <td className="py-4 px-4 text-center text-gray-800">₱99</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className=" bg-zinc-800 view-rentals-btn w-full flex justify-center mt-4 hover:bg-zinc-700 transition-colors">
              <button className="text-white font-bold px-6 py-3 rounded-lg ">
                View all rentals
              </button>
            </div>
          </div>
        </div>
      <div className="info-card-container flex flex-col lg:flex-row bg-zinc-800 justify-start items-center gap-6 md:gap-8 lg:gap-20 xl:gap-36 px-4 md:px-8 lg:px-20 xl:px-36 py-10 md:py-12 lg:py-14">
        <div className="text text-white text-center lg:text-left">
          <h1 className="max-w-xs md:max-w-md lg:max-w-lg text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">Tips & Insights</h1>
        </div>
        <div className="tips-section flex flex-col gap-3 md:gap-4 w-full lg:w-auto">
          <p className="text-white font-semibold text-xs md:text-sm lg:text-base xl:text-2xl min-h-8 md:min-h-10 lg:min-h-12 transition-opacity duration-500">
            {tips[activeTipIndex]}
          </p>
          <div className="tips-list flex flex-row gap-2 md:gap-3 lg:gap-4 items-center">
            {tips.map((tip, index) => (
              <div
                key={index}
                className={`h-2 md:h-2.5 lg:h-3 rounded-full transition-all duration-500 ease-in-out ${
                  index === activeTipIndex
                    ? 'bg-red-600 w-24 md:w-32 lg:w-40 xl:w-48'
                    : 'bg-gray-400 w-16 md:w-20 lg:w-28 xl:w-34'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
