import Image from "next/image";
import Form from "next/form";
import Link from "next/link";
import RadioButtons from "../components/RadioButtons";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const formFields = {
    name: [
      { label: "First Name", id: "FirstName", placeholder: "First Name" },
      { label: "Middle Name", id: "MiddleName", placeholder: "Middle Name" },
      { label: "Last Name", id: "LastName", placeholder: "Last Name" },
    ],
    sex: [
      { label: "Male", id: "male", value: "male" },
      { label: "Female", id: "female", value: "female" },
      { label: "Prefer Not to Say", id: "other", value: "other" },
    ],
    emailAndPass: [
      { label: "Email", id: "email", type: "email", placeholder: "Abcde@gmail.com" },
      { label: "Password", id: "password", type: "password", placeholder: "*********" },
    ],
    addressAndPhone: [
      { label: "Address", id: "address", type: "text", placeholder: "123 st. Metro Manila" },
      { label: "Phone Number", id: "contactNo", type: "tel", placeholder: "+63" },
    ]
  };

  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[url('/bg-image-register.jpg')] bg-cover bg-center opacity-55"></div>
        <div className="absolute z-10 flex justify-center w-full top-6 md:w-full md:justify-center lg:w-auto lg:justify-start lg:left-24 lg:top-16">
          <Image
            src="/lendr-logo.png"
            alt="Lendr Logo"
            width={142}
            height={54}
          />
        </div>
        <div className="z-10 relative flex justify-center items-end lg:justify-end min-h-screen">
          <Form className="register w-full lg:w-5xl">
            <div className="bg-white px-6 py-10 lg:px-22 lg:py-20 lg:mr-28">
              <div className="red-line mx-auto mb-8"></div>
              <div className="flex flex-col justify-center items-center lg:mb-8 lg:items-start">
                <h1 className="text-2xl font-bold text-black mt-0 mb-1 w-fit text-center lg:text-5xl">
                  Create an Account<span className="m-0 p-0 text-red">.</span>
                </h1>
                <p className="text-sm text-black mb-6 lg:text-base">
                  Already have an Account?
                  <Link href="/login" className="font-bold">
                    <span> Log in</span>
                  </Link>
                </p>
              </div>
              <div className="Name-container flex flex-col gap-4 mb-4 lg:flex-row ">
                {formFields.name.map((field) => (
                  <Input
                    key={field.id}
                    label={field.label}
                    type="text"
                    placeholder={field.placeholder}
                    name={field.id}
                    id={field.id}
                    required={true}
                    containerClassName="w-full lg:w-[235px]"
                  ></Input>
                ))}
              </div>
              <div className="bday-radio-container flex flex-col gap-4 mb-4 lg:flex-row">
                <div className="radio-container w-full lg:mr-8">
                  <label className="text-black mb-1.5 block">
                    Sex<span className="text-red">*</span>
                  </label>
                  <div className="flex w-full gap-3 justify-between lg:w-fit">
                    {formFields.sex.map((field) => (
                      <RadioButtons
                        key={field.id}
                        id={field.id}
                        name={field.id}
                        value={field.value}
                        label={field.label}
                      ></RadioButtons>
                    ))}
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
              <div className="email-password flex flex-col  gap-4 mb-4 lg:flex-row">
                {formFields.emailAndPass.map((field) => (
                  <Input
                    key={field.id}
                    label={field.label}
                    htmlFor={field.id}
                    type={field.type}
                    name={field.id}
                    id={field.id}
                    required={true}
                    placeholder={field.placeholder}
                    containerClassName="w-full"
                  ></Input>
                ))}
              </div>
              <div className="address-phone flex flex-col  gap-4 mb-4 lg:flex-row">
                {formFields.addressAndPhone.map((field) => (
                  <Input
                    key={field.id}
                    label={field.label}
                    htmlFor={field.id}
                    type={field.type}
                    name={field.id}
                    id={field.id}
                    required={true}
                    placeholder={field.placeholder}
                    containerClassName="w-full"
                  ></Input>
                ))}
              </div>
              <div className="button-container flex flex-row justify-between gap-3 lg:justify-end">
                <Button
                  label="Cancel"
                  className="text-light-gray flex-1 lg:flex-0 hover:text-red hover:border-red"
                ></Button>
                <Button
                  label="Submit"
                  className="text-white bg-light-gray flex-1 lg:flex-0 hover:bg-red hover:border-red"
                ></Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
