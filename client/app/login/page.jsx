import Image from "next/image";
import Form from "next/form";
import Link from "next/link";
import RadioButtons from "../components/RadioButtons";
import Input from "../components/Input";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";

export default function Login() {
  const formFields = [
    {
      label: "Email",
      name: "email",
      placeholder: "Abcde@gmail.com",
      type: "email",
    },
    {
      label: "Password",
      name: "password",
      placeholder: "********",
      type: "password",
    },
  ];
  return (
    <>
      <div className="relative min-h-screen bg-[url('/bg-login.jpg')] bg-cover bg-center">
        <div className="absolute z-10 flex justify-center w-full top-6 md:w-full md:justify-center lg:w-auto lg:justify-end lg:right-24 lg:top-16 xl:w-auto xl:justify-end xl:left-[150px] xl:top-[89px]">
          <Image
            src="/lendr-logo.png"
            alt="Lendr Logo"
            width={142}
            height={54}
          />
        </div>
        <div className="z-10 relative flex justify-center items-end lg:justify-start xl:justify-start min-h-screen">
          <Form className="login w-full lg:w-auto xl:w-auto">
            <div className="bg-white px-6 py-10 lg:px-22 lg:py-20 lg:ml-28 xl:px-24 xl:py-[113px] xl:ml-[150px]">
              <div className="red-line mx-auto mb-8 xl:mb-[72px]"></div>
              <div className="flex flex-col justify-center items-center lg:w-xl  lg:gap-4 lg:items-start lg:mb-[88px] xl:items-start xl:mb-11">
                <h1 className="text-2xl font-bold text-black mt-0 mb-1 w-fit text-center lg:text-5xl xl:text-[64px]">
                  Welcome back<span className="m-0 p-0 text-red">.</span>
                </h1>
                <p className="text-sm text-black mb-6 lg:text-base xl:text-base">
                  Don&apos;t have an account?
                  <Link href="/register" className="font-bold">
                    <span> Sign Up</span>
                  </Link>
                </p>
              </div>
              <div className="email-password flex flex-col gap-4 mb-4 lg:flex-col xl:justify-between xl:flex-row xl:mb-11 xl:gap-[45px]">
                {formFields.map((field) => (
                  <Input
                    key={field.name}
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    required={true}
                    placeholder={field.placeholder}
                    containerClassName="w-full! mb-6! password-container"
                  ></Input>
                ))}
              </div>
              <div className="remember-me-forgot-container flex justify-between items-center mb-[45px]">
                <Checkbox
                  id="remember-me"
                  name="remember-me"
                  label="Remember Me"
                ></Checkbox>
                <Link href="/">
                  <span className="text-light-gray">Forgot Password</span>
                </Link>
              </div>
              <div className="button-container flex flex-row justify-between gap-3 lg:justify-end xl:justify-end">
                <Button
                  label="Log in"
                  className="text-white bg-light-gray flex-1 lg:flex-1 xl:flex-1"
                ></Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
