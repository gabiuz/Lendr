import Link from "next/link";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function ProductDescription() {
  const rental = {
    name: "Canon EOS 90D",
    pricePerDay: 950,
    rating: 4.5,
    reviews: 10,
  };
  return (
    <div className="h-screen bg-white">
      <Navbar />
      <div className="product-desc-container text-black mt-36 ml-36 grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="breadcrumbs flex items-center gap-2 ">
            <Link href="/homepage" className="text-sm">
              Home
            </Link>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.25854 4.44824C6.32559 4.44826 6.37656 4.46878 6.42847 4.52051L9.72534 7.81738C9.76116 7.85329 9.77811 7.8817 9.78589 7.90039C9.79571 7.92407 9.80151 7.95098 9.80151 7.9834C9.80147 8.0158 9.79576 8.04273 9.78589 8.06641C9.77807 8.08516 9.76134 8.1134 9.72534 8.14941L6.41187 11.4619C6.36016 11.5135 6.3161 11.5283 6.26245 11.5264C6.19961 11.5241 6.14502 11.5027 6.08765 11.4453C6.03566 11.3933 6.01538 11.3416 6.01538 11.2744C6.01545 11.2074 6.03586 11.1564 6.08765 11.1045L9.20874 7.9834L8.97339 7.74707L6.07104 4.84473C6.01953 4.79306 6.00562 4.74895 6.00757 4.69531C6.00987 4.63247 6.03028 4.57788 6.08765 4.52051C6.13972 4.46845 6.19129 4.44824 6.25854 4.44824Z"
                fill="black"
                stroke="black"
                strokeWidth="0.666667"
              />
            </svg>
            <Link href="/product-result" className="text-sm">
              Products
            </Link>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.25854 4.44824C6.32559 4.44826 6.37656 4.46878 6.42847 4.52051L9.72534 7.81738C9.76116 7.85329 9.77811 7.8817 9.78589 7.90039C9.79571 7.92407 9.80151 7.95098 9.80151 7.9834C9.80147 8.0158 9.79576 8.04273 9.78589 8.06641C9.77807 8.08516 9.76134 8.1134 9.72534 8.14941L6.41187 11.4619C6.36016 11.5135 6.3161 11.5283 6.26245 11.5264C6.19961 11.5241 6.14502 11.5027 6.08765 11.4453C6.03566 11.3933 6.01538 11.3416 6.01538 11.2744C6.01545 11.2074 6.03586 11.1564 6.08765 11.1045L9.20874 7.9834L8.97339 7.74707L6.07104 4.84473C6.01953 4.79306 6.00562 4.74895 6.00757 4.69531C6.00987 4.63247 6.03028 4.57788 6.08765 4.52051C6.13972 4.46845 6.19129 4.44824 6.25854 4.44824Z"
                fill="black"
                stroke="black"
                strokeWidth="0.666667"
              />
            </svg>
            <p className="text-sm font-semibold">{rental.name}</p>
          </div>
          <div className="title">
            <h1 className="text-4xl font-bold">{rental.name}</h1>
          </div>
          <div className="price">
            <h2 className="text-base font-bold">
              <span className="text-sky-800">{rental.pricePerDay}</span>/day | (
              {rental.rating} stars) | {rental.reviews} reviews
            </h2>
          </div>
          <div className="product-description font-medium text-base">
            <p>
              The Canon EOS 90D is a fast, high-resolution DSLR ideal for
              events, portraits, travel, and professional content creation. Each
              rental unit undergoes a full check before release—cleaned, tested,
              and confirmed to be in excellent working condition. The package
              includes the camera body, battery, charger, neck strap, and basic
              documentation, ensuring you have everything you need for a smooth
              shoot. Whether you&apos;re a hobbyist or a professional, our goal
              is to provide reliable gear that performs consistently throughout
              your rental period.
            </p>
            <br />
            <p className="font-bold">What&apos;s Included:</p>
            <ul className="list-disc flex flex-col justify-center pl-5">
              <li>Canon EOS 90D Body</li>
              <li>Original Battery & Charger</li>
              <li>Neck Strap</li>
              <li>Basic Documentation</li>
              <li>Clean and tested before dispatch</li>
            </ul>
          </div>
          <div className="owner-container flex items-center gap-3.5">
            <Image
              src="/pictures/sample-pfp-productCard.png"
              alt="Owner-profile-picture"
              width={54}
              height={54}
              className="rounded-full w-14 h-14"
            />
            <div>
              <p className="font-bold">Rental Owner Name</p>
              <p className="text-zinc-800 text-base font-normal font-['Montserrat'] leading-6">
                Rental Owner
              </p>
            </div>
          </div>
          <div className="buttons-container flex flex-col gap-4">
            <button className="bg-red-600 hover:bg-red-700 hover:shadow-md rounded-xl px-6 py-2.5  text-white text-base font-semibold transition-colors duration-200 w-full cursor-pointer">
              Book Now
            </button>
            <button className="bg-white border-2 hover:shadow-md border-light-gray hover:border-[#FF0000] hover:text-black hover:bg-[#FF000040] rounded-xl px-6 py-2.5 text-light-gray text-base font-semibold transition-colors duration-200 w-full cursor-pointer">
              Message Owner
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {/* Second column - add content here */}
        </div>
      </div>
    </div>
  );
}
