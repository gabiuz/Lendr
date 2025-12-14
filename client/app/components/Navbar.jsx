"use client";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({
  logoSrc = "/lendr-log-gradient.png",
  logoAlt = "blendr logo",
}) {
  return (
    <nav className="bg-white flex justify-between items-center px-8 py-4 xl:px-24 xl:py-8 shadow-2xl">
      <Link href="/homepage" className="cursor-pointer">
        <Image
          src={logoSrc}
          width={142}
          height={54}
          alt={logoAlt}
          className="w-20 xl:w-32"
        />
      </Link>
      {/* Nav links */}
      <div className="text-black">
        <ul className="flex gap-8 xl:gap-16 font-semibold text-base xl:text-lg">
          <li className="hover:text-red">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-red">
            <Link href="/">Browse Rentals</Link>
          </li>
          <li className="hover:text-red">
            <Link href="/">Categories</Link>
          </li>
          <li className="hover:text-red">
            <Link href="/">About Us</Link>
          </li>
        </ul>
      </div>
      {/* Buttons */}
      <div className="text-black flex items-center gap-4 xl:gap-6">
        <Link href="/register">
          <button className="bg-(--dark-red) hover:bg-red text-white font-semibold px-6 py-3 rounded-full cursor-pointer">
            + Be a Rental Owner
          </button>
        </Link>
        <Link href="/profile">
          <button className="flex items-center gap-2 cursor-pointer font-semibold px-4 py-2">
            <svg width="20" height="19" viewBox="0 0 19 19" fill="none">
              <path
                d="M15.8333 16.625V15.0417C15.8333 14.2018 15.4997 13.3964 14.9058 12.8025C14.3119 12.2086 13.5065 11.875 12.6666 11.875H6.33329C5.49344 11.875 4.68799 12.2086 4.09412 12.8025C3.50026 13.3964 3.16663 14.2018 3.16663 15.0417V16.625"
                stroke="#211D1B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.50004 8.70833C11.2489 8.70833 12.6667 7.29057 12.6667 5.54167C12.6667 3.79276 11.2489 2.375 9.50004 2.375C7.75114 2.375 6.33337 3.79276 6.33337 5.54167C6.33337 7.29057 7.75114 8.70833 9.50004 8.70833Z"
                stroke="#211D1B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Profile
          </button>
        </Link>
      </div>
    </nav>
  );
}
