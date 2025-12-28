"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({
  logoSrc = "/lendr-log-gradient.png",
  logoAlt = "blendr logo",
  links = [
    { href: "#home", label: "Home" },
    { href: "#browse", label: "Browse Rentals" },
    { href: "#categories", label: "Categories" },
    { href: "#aboutUs", label: "About Us" },
  ],
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-2xl fixed top-0 right-0 left-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-6 lg:px-8 xl:px-24 py-3 md:py-4 xl:py-8">
        <Link href="/homepage" className="cursor-pointer">
          <Image
            src={logoSrc}
            width={142}
            height={54}
            alt={logoAlt}
            className="w-20 md:w-24 lg:w-28 xl:w-32"
          />
        </Link>

        {/* Desktop Nav links */}
        <div className="hidden lg:block text-black">
          <ul className="flex gap-6 lg:gap-8 xl:gap-16 font-semibold text-sm lg:text-base xl:text-lg">
            {links.map((link, index) => (
              <li key={index} className="hover:text-red transition-colors">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex text-black items-center gap-3 lg:gap-4 xl:gap-6">
          <Link href="/register">
            <button className="bg-red-800 hover:bg-red-900 text-white font-semibold px-4 lg:px-5 xl:px-6 py-2 lg:py-2.5 xl:py-3 rounded-full cursor-pointer text-sm lg:text-base transition-colors whitespace-nowrap">
              + Be a Rental Owner
            </button>
          </Link>
          <Link href="/profile">
            <button className="flex items-center gap-2 cursor-pointer font-semibold px-3 lg:px-4 py-2 hover:text-red transition-colors">
              <svg width="20" height="19" viewBox="0 0 19 19" fill="none">
                <path
                  d="M15.8333 16.625V15.0417C15.8333 14.2018 15.4997 13.3964 14.9058 12.8025C14.3119 12.2086 13.5065 11.875 12.6666 11.875H6.33329C5.49344 11.875 4.68799 12.2086 4.09412 12.8025C3.50026 13.3964 3.16663 14.2018 3.16663 15.0417V16.625"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.50004 8.70833C11.2489 8.70833 12.6667 7.29057 12.6667 5.54167C12.6667 3.79276 11.2489 2.375 9.50004 2.375C7.75114 2.375 6.33337 3.79276 6.33337 5.54167C6.33337 7.29057 7.75114 8.70833 9.50004 8.70833Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm lg:text-base">Profile</span>
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-black hover:text-red transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Nav Links */}
            <ul className="space-y-3 text-black font-semibold">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="block py-2 hover:text-red transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Buttons */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <Link href="/register" className="block">
                <button
                  className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold px-4 py-3 rounded-full cursor-pointer transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  + Be a Rental Owner
                </button>
              </Link>
              <Link href="/profile" className="block">
                <button
                  className="w-full flex items-center justify-center gap-2 cursor-pointer font-semibold px-4 py-3 border border-gray-300 rounded-full hover:border-red hover:text-red transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg width="20" height="19" viewBox="0 0 19 19" fill="none">
                    <path
                      d="M15.8333 16.625V15.0417C15.8333 14.2018 15.4997 13.3964 14.9058 12.8025C14.3119 12.2086 13.5065 11.875 12.6666 11.875H6.33329C5.49344 11.875 4.68799 12.2086 4.09412 12.8025C3.50026 13.3964 3.16663 14.2018 3.16663 15.0417V16.625"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.50004 8.70833C11.2489 8.70833 12.6667 7.29057 12.6667 5.54167C12.6667 3.79276 11.2489 2.375 9.50004 2.375C7.75114 2.375 6.33337 3.79276 6.33337 5.54167C6.33337 7.29057 7.75114 8.70833 9.50004 8.70833Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
