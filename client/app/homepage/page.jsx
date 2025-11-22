import Image from "next/image";
import Link from "next/link";

export default function Homepage() {
  return (
    <>
      <div className="min-h-screen min-w-screen">
        <nav className="bg-white flex lg:justify-between lg:items-center lg:px-16 lg:py-4 xl:px-[137px] xl:py-11">
          <Image
            src="/lendr-log-gradient.png"
            width={142}
            height={54}
            alt="blendr logo"
            className="lg:w-24"
          ></Image>
          <div className="text-black ">
            <ul className="flex lg:gap-12 xl:gap-[69px] font-semibold">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/">Browse Rentals</Link>
              </li>
              <li>
                <Link href="/">Categories</Link>
              </li>
              <li>
                <Link href="/">About Us</Link>
              </li>
            </ul>
          </div>
          <div className="text-black flex lg:gap-4">
            <button>
              <Link href="/register">Be a rental Owner</Link>
            </button>
            <button>
              <Link href="/">Profile</Link>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
