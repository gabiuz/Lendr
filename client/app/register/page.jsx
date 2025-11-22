import Image from "next/image";
import Form from "next/form";
import Link from "next/link";
import RadioButtons from "../components/RadioButtons";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[url('/bg-register-login.jpg')] bg-cover bg-center opacity-55"></div>
        <div className="absolute z-10 flex justify-center w-full top-6 md:w-full md:justify-center lg:w-full lg:justify-center xl:w-auto xl:justify-start xl:left-[150px] xl:top-[89px]">
          <Image
            src="/lendr-logo.png"
            alt="Lendr Logo"
            width={142}
            height={54}
          />
        </div>
        <div className="z-10 relative flex justify-center items-end xl:justify-end min-h-screen">
          <Form className="login w-full xl:w-auto">
            <div className="bg-white px-6 py-10 xl:px-24 xl:py-[113px] xl:mr-[150px]">
              <div className="red-line mx-auto mb-8 xl:mb-[72px]"></div>
              <div className="flex flex-col justify-center items-center xl:items-start xl:mb-11">
                <h1 className="text-2xl font-bold text-black mt-0! mb-1 w-fit text-center xl:text-[64px]">
                  Create an Account<span className="m-0 p-0 text-red">.</span>
                </h1>
                <p className="text-sm text-black mb-6 xl:text-base">
                  Already have an Account?
                  <Link href="/login" className="font-bold">
                    <span> Log in</span>
                  </Link>
                </p>
              </div>
              <div className="Name-container flex flex-col gap-4 mb-4 xl:flex-row xl:mb-[30px]">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  name="FirstName"
                  id="FirstName"
                  required={true}
                  containerClassName="w-full"
                ></Input>
                <Input
                  label="Middle Name"
                  type="text"
                  placeholder="Middle Name"
                  name="MiddleName"
                  id="MiddleName"
                  required={true}
                  containerClassName="w-full"
                ></Input>
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Last Name"
                  name="LastName"
                  id="LastName"
                  required={true}
                  containerClassName="w-full"
                ></Input>
              </div>
              <div className="bday-radio-container flex flex-col gap-4 mb-4 xl:flex-row xl:gap-[58px] xl:justify-between xl:mb-[30px]">
                <div className="radio-container w-full">
                  <label className="text-black mb-1.5 block">
                    Sex<span className="text-red">*</span>
                  </label>
                  <div className="flex w-full gap-3 justify-between xl:align-center xl:gap-[21px]">
                    <RadioButtons
                      id="Male"
                      name="Sex"
                      value="Male"
                      label="Male"
                    ></RadioButtons>
                    <RadioButtons
                      id="Female"
                      name="Sex"
                      value="Female"
                      label="Female"
                    ></RadioButtons>
                    <RadioButtons
                      id="Other"
                      name="Sex"
                      value="Other"
                      label="Prefer Not to Say"
                    ></RadioButtons>
                  </div>
                </div>
                <Input
                  label="Birthday"
                  type="date"
                  name="bday"
                  id="bday"
                  placeholder="Birthday"
                  className="text-light-gray"
                  containerClassName="w-full"
                  required={true}
                ></Input>
              </div>
              <div className="email-phone flex flex-col  gap-4 mb-4 xl:justify-between xl:flex-row xl:mb-11 xl:gap-[29px]">
                <Input
                  label="Email"
                  htmlFor="email"
                  type="email"
                  name="email"
                  id="email"
                  required={true}
                  placeholder="Abcde@gmail.com"
                  containerClassName="w-full"
                ></Input>
                <Input
                  label="Phone Number"
                  htmlFor="phone"
                  type="tel"
                  name="phone"
                  id="phone"
                  required={true}
                  placeholder="+63"
                  containerClassName="w-full"
                ></Input>
              </div>
              <Input
                label="Address"
                htmlFor="address"
                type="text"
                name="address"
                id="address"
                required={true}
                placeholder="123 St. Metro Manila"
                containerClassName="w-full! mb-6! address-container"
              ></Input>
              <div className="button-container flex flex-row justify-between gap-3! xl:justify-end">
                <Button
                  label="Cancel"
                  className="text-light-gray flex-1 xl:flex-0"
                ></Button>
                <Button
                  label="Submit"
                  className="text-white bg-light-gray flex-1 xl:flex-0"
                ></Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
