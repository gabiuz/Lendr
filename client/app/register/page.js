import Image from "next/image";
import Form from "next/form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-[url('/bg-image-login.jpg')] bg-cover bg-center opacity-55"></div>
        <div className="z-10 absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
          <Image
            src="/lendr-logo.png"
            alt="Lendr Logo"
            width={100}
            height={38}
            className="w-24 sm:w-32 lg:w-36"
          />
        </div>
        <div className="z-10 absolute bottom-6 right-50">
          <Form className="login">
            <div className="bg-white pl-[85px]! pt-[141px]! pr-[207px]!">
              <h1 className="text-[64px]! font-bold text-black">
                Create an Account<span className="m-0 p-0 text-red">.</span>
              </h1>
              <p className="text-base text-black">
                Already have an Account?
                <Link href="" className="font-bold">
                  Log in
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
