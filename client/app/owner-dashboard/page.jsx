"use client";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function OwnerDashboard() {
    return (
        <div>
            <Navbar 
                links={[
                    {
                        href: "#owner-homepage",
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
                    }
                ]}
                showOwnerButton={false}
                profileInCircle={true}
            />
            {/* image hero section */}
<div className="bg-[url('/owner-dashboard-image.jpg')] bg-opacity bg-cover bg-center h-[500px] md:h-[600px] xl:w-[1921px] xl:h-[766px]"></div>
        </div>
    );
}