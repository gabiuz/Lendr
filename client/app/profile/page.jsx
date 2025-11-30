import Link from "next/link";
import Image from "next/image";

export default function Profile(){
  return (
    <>
    <div className="bg-white min-h-screen w-full">
      <nav className="bg-white flex justify-between shadow-md">
            <Image
              src="/lendr-log-gradient.png"
              width={142}
              height={54}
              alt="blendr logo"
              className="w-20 xl:w-32 px-2 py-3"
            />
      </nav>
    </div>
    </>
  )
}