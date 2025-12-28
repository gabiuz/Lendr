"use client";
import Navbar from "../components/Navbar";

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
        </div>
    );
}