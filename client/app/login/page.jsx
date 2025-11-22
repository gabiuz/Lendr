import Image from "next/image";
import Form from "next/form";
import Link from "next/link";
import RadioButtons from "../components/RadioButtons";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  return (
    <>
    <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[url('/login-bg.jpg')] bg-cover bg-center opacity-55"></div>
        <div className="absolute z-10 flex justify-center w-full top-6 md:w-full md:justify-center lg:w-full lg:justify-center xl:w-auto xl:justify-end xl:right-[150px] xl:top-[89px]">
          <Image
            src="/lendr-logo.png"
            alt="Lendr Logo"
            width={142}
            height={54}
          />
        </div>
    </div>
    </>
  );
}
