"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({
  logoSrc = "/lendr-log-gradient.png",
  logoAlt = "blendr logo",
  links = [
    { href: "/homepage", label: "Home" },
    { href: "#browse", label: "Browse Rentals" },
    { href: "#categories", label: "Categories" },
    { href: "/homepage#aboutUs", label: "About Us" },
  ],
  showOwnerButton = true,
  profileInCircle = false,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasBusinessAccount, setHasBusinessAccount] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const customerId = localStorage.getItem("customer_id");
    const ownerId = localStorage.getItem("owner_id");
    setIsLoggedIn(!!customerId);
    setHasBusinessAccount(!!ownerId);
    function onStorage(e) {
      if (e.key === "customer_id") setIsLoggedIn(!!e.newValue);
      if (e.key === "owner_id") setHasBusinessAccount(!!e.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer_id");
    localStorage.removeItem("owner_id");
    setIsLoggedIn(false);
    router.push("/homepage");
  };

  const handleLogin = () => {
    router.push("/login");
  };

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
          {isLoggedIn && showOwnerButton && !hasBusinessAccount && (
            <Link href="/owner-register">
              <button className="bg-red-800 hover:bg-red-900 text-white font-semibold px-4 lg:px-5 xl:px-6 py-2 lg:py-2.5 xl:py-3 rounded-full cursor-pointer text-sm lg:text-base transition-colors whitespace-nowrap">
                + Be a Rental Owner
              </button>
            </Link>
          )}

          {isLoggedIn && hasBusinessAccount && !profileInCircle && (
            <Link href="/owner-homepage">
              <button className="bg-red-800 hover:bg-red-900 text-white font-semibold px-4 lg:px-5 xl:px-6 py-2 lg:py-2.5 xl:py-3 rounded-full cursor-pointer text-sm lg:text-base transition-colors whitespace-nowrap">
                Business Profile
              </button>
            </Link>
          )}

          {isLoggedIn ? (
            <>
              {!profileInCircle && (
                <Link href={`${profileInCircle ? "/owner-profile" : "/profile"}`}>
                  <button className={`flex items-center gap-2 cursor-pointer font-semibold transition-colors ${
                    profileInCircle
                      ? "bg-red-800 hover:bg-red-900 text-white px-3 lg:px-7 lg:py-3.5 rounded-full"
                      : "px-3 lg:px-4 py-2 hover:text-red"
                  }`}>
                    <svg width="20" height="19" viewBox="0 0 19 19" fill="none">
                      <path d="M15.8333 16.625V15.0417C15.8333 14.2018 15.4997 13.3964 14.9058 12.8025C14.3119 12.2086 13.5065 11.875 12.6666 11.875H6.33329C5.49344 11.875 4.68799 12.2086 4.09412 12.8025C3.50026 13.3964 3.16663 14.2018 3.16663 15.0417V16.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.50004 8.70833C11.2489 8.70833 12.6667 7.29057 12.6667 5.54167C12.6667 3.79276 11.2489 2.375 9.50004 2.375C7.75114 2.375 6.33337 3.79276 6.33337 5.54167C6.33337 7.29057 7.75114 8.70833 9.50004 8.70833Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm lg:text-base">Profile</span>
                  </button>
                </Link>
              )}

              {profileInCircle && (
                <Link href="/homepage">
                  <button className="bg-red-800 hover:bg-red-900 text-white font-semibold px-4 lg:px-5 xl:px-6 py-2 lg:py-2.5 xl:py-3 rounded-full cursor-pointer text-sm lg:text-base transition-colors whitespace-nowrap">
                    Personal Profile
                  </button>
                </Link>
              )}

              {profileInCircle && (
                <Link href="/owner-profile">
                  <button className="text-black hover:text-red-400 font-semibold px-4 lg:px-5 xl:px-6 py-2 lg:py-2.5 xl:py-3 cursor-pointer text-sm lg:text-base transition-colors whitespace-nowrap">
                    Business Profile
                  </button>
                </Link>
              )}

              <button onClick={handleLogout} className="flex items-center gap-2 cursor-pointer font-semibold px-3 lg:px-4 py-2 hover:text-red transition-colors" title="Logout">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span className="text-sm lg:text-base">Logout</span>
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="flex items-center gap-2 cursor-pointer font-semibold px-3 lg:px-4 py-2 hover:text-red transition-colors" title="Login">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <span className="text-sm lg:text-base">Login</span>
            </button>
          )}
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

            {/* Mobile Buttons*/}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              {isLoggedIn && showOwnerButton && !hasBusinessAccount && (
                <Link href="/owner-register" className="block">
                  <button
                    className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold px-4 py-3 rounded-full cursor-pointer transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    + Be a Rental Owner
                  </button>
                </Link>
              )}
              {isLoggedIn && hasBusinessAccount && !profileInCircle && (
                <Link href="/owner-homepage" className="block">
                  <button
                    className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold px-4 py-3 rounded-full cursor-pointer transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Business Profile
                  </button>
                </Link>
              )}
              {!profileInCircle && (
                <Link href="/profile" className="block">
                  <button
                    className="w-full flex items-center justify-center gap-2 cursor-pointer font-semibold px-4 py-3 rounded-full border border-gray-300 hover:border-red hover:text-red transition-colors"
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
              )}

              {profileInCircle && (
                <Link href="/homepage" className="block">
                  <button
                    className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold px-4 py-3 rounded-full cursor-pointer transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Personal Profile
                  </button>
                </Link>
              )}

              {profileInCircle && (
                <Link href="/owner-profile" className="block">
                  <button
                    className="w-full text-black hover:text-red-400 font-semibold px-4 py-3 cursor-pointer transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Business Profile
                  </button>
                </Link>
              )}

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer font-semibold px-4 py-3 rounded-full border border-gray-300 hover:border-red hover:text-red transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer font-semibold px-4 py-3 rounded-full border border-gray-300 hover:border-red hover:text-red transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
