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
        <div className="absolute inset-0 bg-[url('/bg-image-login.jpg')] bg-cover bg-center opacity-55"></div>
        <div className="absolute z-10 lg:left-[150px] lg:top-[89px]">
          <Image
            src="/lendr-logo.png"
            alt="Lendr Logo"
            width={142}
            height={54}
          />
        </div>
        <div className="z-10 relative flex justify-end items-end min-h-screen">
          <Form className="login">
            <div className="bg-white xl:px-24 xl:py-[113px] mr-[150px]">
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
