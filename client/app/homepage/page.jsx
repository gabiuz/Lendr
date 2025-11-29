import Image from "next/image";
import Link from "next/link";

export default function Homepage() {
  return (
    <>
      <div className="min-h-screen min-w-screen">
        <nav className="bg-white flex lg:justify-between lg:items-center lg:px-16 lg:py-4 2xl:px-[137px] 2xl:py-11">
          <Link href="/homepage" className="cursor-pointer">
          <Image
            src="/lendr-log-gradient.png"
            width={142}
            height={54}
            alt="blendr logo"
            className="lg:w-24 2xl:w-[142px] 2xl:h-[54px]"
          ></Image>
          </Link>
          <div className="text-black 2xl:text-2xl">
            <ul className="flex lg:gap-12 2xl:gap-[69px] font-semibold">
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
          <div className="text-black flex justify-center items-center lg:gap-4">
            <Link href="/register">
              <button className="bg-(--dark-red) hover:bg-red text-white font-semibold lg:px-[30px] lg:py-[15px] lg:rounded-[45px] cursor-pointer">+ Be a Rental Owner</button>
            </Link>
            <Link href="/register">
              <div className="px-[30px] py-[15px]">
                <button className="flex gap-2 cursor-pointer font-semibold">
                  <span>
                  <svg width="20" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.8333 16.625V15.0417C15.8333 14.2018 15.4997 13.3964 14.9058 12.8025C14.3119 12.2086 13.5065 11.875 12.6666 11.875H6.33329C5.49344 11.875 4.68799 12.2086 4.09412 12.8025C3.50026 13.3964 3.16663 14.2018 3.16663 15.0417V16.625" stroke="#211D1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.50004 8.70833C11.2489 8.70833 12.6667 7.29057 12.6667 5.54167C12.6667 3.79276 11.2489 2.375 9.50004 2.375C7.75114 2.375 6.33337 3.79276 6.33337 5.54167C6.33337 7.29057 7.75114 8.70833 9.50004 8.70833Z" stroke="#211D1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                  Profile</button>
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
