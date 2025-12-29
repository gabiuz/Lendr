"use client";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function OwnerDashboard() {
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
      <div className="overview-container mt-20">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-black mx-auto">Overview</h2>
        </div>
      </div>
    </div>
  );
}
