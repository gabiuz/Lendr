import Image from "next/image";
import Form from "next/form";
import Link from "next/link";
import RadioButtons from "../components/RadioButtons";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  return (
    <>
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-image-login.jpg')] bg-cover bg-center opacity-55"></div>
        <div className="image z-10">
          <Image
            src="/lendr-logo.png"
            alt="Lendr Logo"
            width={142}
            height={54}
            className="lg:ml-28 lg:pt-20 xl:ml-36 xl:pt-20"
          />
        </div>
        <div className="z-10 relative flex xl:justify-end xl:align-end min-h-0">
          <Form className="login">
            <div className="bg-white sm:px-1.5 md:px-16 lg:px-20 xl:px-24 sm:mt-20 md:mt-28 lg:mt-32 xl:mt-0 m:py-3 md:py-16 lg:py-24 xl:py-[113px] md:mr-10 lg:mr-16 xl:mr-[150px]">
              <div className="red-line mx-auto! mb-[72px]!"></div>
              <h1 className=" sm:text-1xl md:text-3xl lg:text-5xl xl:text-[64px] font-bold text-black mt-0! md:mb-1.5 lg:mb-3 w-fit">
                Create an Account<span className="m-0 p-0 text-red">.</span>
              </h1>
              <p className="md:text-sm lg:text-base text-black mb-11!">
                Already have an Account?
                <Link href="/login" className="font-bold">
                  <span> Log in</span>
                </Link>
              </p>
              <div className="Name-container flex gap-8! mb-[30px]!">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  name="FirstName"
                  id="FirstName"
                  required={true}
                  containerClassName="w-60"
                ></Input>
                <Input
                  label="Middle Name"
                  type="text"
                  placeholder="Middle Name"
                  name="MiddleName"
                  id="MiddleName"
                  required={true}
                  containerClassName="w-60"
                ></Input>
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Last Name"
                  name="LastName"
                  id="LastName"
                  required={true}
                  containerClassName="w-60"
                ></Input>
              </div>
              <div className="bday-radio-container flex justify-between items-center mb-[30px]!">
                <div className="radio-container">
                  <label className="text-black mb-1.5">
                    Sex<span className="text-red">*</span>
                  </label>
                  <div className="flex w-fit gap-[21px]! justify-center align-center">
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
                  containerClassName="w-[381px]!"
                  required={true}
                ></Input>
              </div>
              <div className="email-phone flex justify-between mb-11!">
                <Input
                  label="Email"
                  htmlFor="email"
                  type="email"
                  name="email"
                  id="email"
                  required={true}
                  placeholder="Abcde@gmail.com"
                  containerClassName="w-[381px]!"
                ></Input>
                <Input
                  label="Phone Number"
                  htmlFor="phone"
                  type="tel"
                  name="phone"
                  id="phone"
                  required={true}
                  placeholder="+63"
                  containerClassName="w-[381px]!"
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
                containerClassName="w-full! mb-[50px]! address-container"
              ></Input>
              <div className="button-container flex flex-row justify-end gap-[15px]!">
                <Button label="Cancel" className="text-light-gray"></Button>
                <Button
                  label="Submit"
                  className="text-white bg-light-gray"
                ></Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
