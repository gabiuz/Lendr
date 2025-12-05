import Image from "next/image";
import Link from "next/link";
import Search from "../components/Search";
import Categories from "../components/Categories";

export default function Homepage() {
  const categories = [
    { id: "allItems", icon: "car", label: "All Items" },
    { id: "vehicles", icon: "car", label: "Vehicles" },
    { id: "devices", icon: "computer", label: "Devices & Electronics" },
    { id: "clothing", icon: "pin", label: "Clothing & Apparel" },
    { id: "tools", icon: "tools", label: "Tools & Equipment" },
    { id: "furniture", icon: "bed", label: "Furniture & Home" },
    { id: "party", icon: "party", label: "Party & Events" },
  ];

  return (
    <div className="min-h-screen w-full">
      <nav className="bg-white flex justify-between items-center px-8 py-4 xl:px-24 xl:py-8">
        <Link href="/homepage" className="cursor-pointer">
          <Image
            src="/lendr-log-gradient.png"
            width={142}
            height={54}
            alt="blendr logo"
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

      <header className="h-[600px] xl:h-[750px] bg-[url('/homepage-bg-image.jpg')] bg-opacity bg-cover bg-center">
        <div className="flex flex-col items-center gap-6 pt-40 text-center px-4">
          <h1 className="text-white font-bold text-4xl xl:text-6xl">
            Rent Anything, <span className="text-red"> Anytime</span>
          </h1>
          <p className="text-white font-medium text-base xl:text-xl max-w-2xl">
            Search thousands of listings across categories. Compare prices,
            check availability, and rent securely — all in one place.
          </p>
        </div>
        <div className="flex justify-center items-center px-4 py-4">
          <div className="flex bg-white lg:px-4 lg:py-4 lg:w-fit lg:gap-5 items-center rounded-2xl lg:mt-16">
            <Search />
            <button className="cursor-pointer">
              <svg
                width="66"
                height="66"
                viewBox="0 0 66 66"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="66" height="66" rx="33" fill="#FF0000" />
                <path
                  d="M40.3594 30.1092C40.3594 23.9357 35.3605 18.9354 29.1886 18.9354C23.0168 18.9354 18.0179 23.9357 18.0179 30.1092C18.0179 36.2827 23.0168 41.283 29.1886 41.283C35.3605 41.283 40.3594 36.2827 40.3594 30.1092ZM38.2021 41.4995C35.7305 43.4619 32.5957 44.6351 29.1886 44.6351C21.1666 44.6351 14.6666 38.1334 14.6666 30.1092C14.6666 22.0851 21.1666 15.5833 29.1886 15.5833C37.2107 15.5833 43.7107 22.0851 43.7107 30.1092C43.7107 33.5172 42.5377 36.6529 40.5759 39.1251L49.9244 48.4761C49.9244 48.4761 50.5807 49.1326 50.5807 50.1941C50.5807 51.2556 49.9244 51.4931 49.2681 51.4931C48.6118 51.4931 48.2069 51.5 47.5576 50.8436L38.2021 41.4995Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="category-container bg-white">
        <h2 className="flex text-black font-bold lg:text-4xl lg:pt-28 lg:pb-12 lg:justify-center">
          Browse By Category
        </h2>
        <div className="flex justify-center gap-6 categories-container ">
          {categories.map((category) => (
            <Categories
              key={category.id}
              icon={category.icon}
              label={category.label}
            ></Categories>
          ))}
        </div>
      </div>
    </div>
  );
}
