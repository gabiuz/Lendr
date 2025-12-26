import Image from "next/image";
import Input from "../components/Input";
import RadioButtons from "../components/RadioButtons";
import Button from "../components/Button";

export default function Profile() {
  const formFields = {
    name: [
      { label: "First Name", id: "FirstName", placeholder: "First Name" },
      { label: "Middle Name", id: "MiddleName", placeholder: "Middle Name" },
      { label: "Last Name", id: "LastName", placeholder: "Last Name" },
    ],
    sex: [
      { label: "Male", id: "male", value: "male", name: "sex" },
      { label: "Female", id: "female", value: "female", name: "sex" },
      { label: "Prefer Not to Say", id: "other", value: "other", name: "sex" },
    ],
    emailAndPhone: [
      { label: "Email", id: "email", type: "email", placeholder: "Abcde@gmail.com" },
      { label: "Phone Number", id: "contactNo", type: "tel", placeholder: "+63" },
    ],
    address: [
      { label: "Address", id: "address", type: "text", placeholder: "123 st. Metro Manila" },
    ],
    birthday: [
      { label: "Birthday", id: "birthday", type: "date", placeholder: "2005-04-28" },
    ]
  };
  return (
    <>
      <div className="bg-white min-h-screen w-full">
        <nav className="bg-white flex justify-between shadow-md">
          <Image
            src="/lendr-log-gradient.png"
            width={142}
            height={54}
            alt="blendr logo"
            className="w-24 md:w-28 lg:w-30 xl:w-32 px-2 md:px-3 py-2 md:py-3"
          />
        </nav>
        <div className="text-black flex justify-between px-4 md:px-8 lg:px-36 py-6 md:py-8 pt-12 md:pt-16 lg:pt-24">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Profile Settings</h1>
          <button className="flex justify-center items-center gap-1 md:gap-1.5 cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-7 md:h-7">
              <path opacity="0.4" d="M10.9768 17.0232L13.5362 16.2926C13.7068 16.2444 13.8643 16.1526 13.9912 16.0257L19.8668 10.1501L17.8499 8.13318L11.9787 14.0088C11.8518 14.1357 11.7599 14.2932 11.7118 14.4638L10.9812 17.0232H10.9768Z" fill="black" />
              <path d="M22.0938 5.37684L22.6232 5.90621C23.0344 6.31746 23.0344 6.98246 22.6232 7.38934L21.35 8.66684L19.3332 6.64996L20.6063 5.37684C21.0175 4.96559 21.6826 4.96559 22.0894 5.37684H22.0938ZM11.9788 14.0087L17.85 8.13309L19.8669 10.15L13.9913 16.0212C13.8644 16.1481 13.7069 16.24 13.5363 16.2881L10.9769 17.0187L11.7076 14.4593C11.7557 14.2887 11.8476 14.1312 11.9744 14.0043L11.9788 14.0087ZM19.1232 3.89371L10.4913 12.5212C10.1107 12.9018 9.83505 13.37 9.69067 13.8818L8.43942 18.2568C8.33442 18.6243 8.43505 19.0181 8.7063 19.2893C8.97755 19.5606 9.3713 19.6612 9.7388 19.5562L14.1138 18.305C14.63 18.1562 15.0982 17.8806 15.4744 17.5043L24.1063 8.87684C25.3357 7.64746 25.3357 5.65246 24.1063 4.42309L23.5769 3.89371C22.3476 2.66434 20.3526 2.66434 19.1232 3.89371ZM6.65005 5.59996C4.5238 5.59996 2.80005 7.32371 2.80005 9.44996V21.35C2.80005 23.4762 4.5238 25.2 6.65005 25.2H18.55C20.6763 25.2 22.4001 23.4762 22.4001 21.35V16.45C22.4001 15.8681 21.9319 15.4 21.35 15.4C20.7682 15.4 20.3001 15.8681 20.3001 16.45V21.35C20.3001 22.3168 19.5169 23.1 18.55 23.1H6.65005C5.68317 23.1 4.90005 22.3168 4.90005 21.35V9.44996C4.90005 8.48309 5.68317 7.69996 6.65005 7.69996H11.55C12.1319 7.69996 12.6 7.23184 12.6 6.64996C12.6 6.06809 12.1319 5.59996 11.55 5.59996H6.65005Z" fill="black" />
            </svg>
            <p className="text-sm md:text-base">Edit Profile</p>
          </button>
        </div>
        <div className="flex flex-col lg:flex-row lg:gap-8 px-4 md:px-8 lg:px-36">
          <div className="flex justify-center items-start lg:justify-start">
            <Image
              src="/pictures/sample-profile-photo.jpg"
              alt="profile photo"
              height={300}
              width={300}
              className="rounded-4xl w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="Name-container flex flex-col gap-3 md:gap-4 mb-4 mt-4 md:mt-6 mx-0 lg:flex-row lg:mx-0">
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
                />
              ))}
            </div>
            <div className="radio-container w-full px-4 mb-4 lg:px-0">
              <label className="text-black mb-1.5 block">
                Sex<span className="text-red">*</span>
              </label>
              <div className="lg:flex lg:justify-center lg:items-center">
                <div className="flex w-full gap-3 justify-around lg:justify-start">
                  {formFields.sex.map((field) => (
                    <RadioButtons
                      key={field.id}
                      id={field.id}
                      name={field.name}
                      value={field.value}
                      label={field.label}
                    />
                  ))}
                </div>
                {formFields.birthday.map((field) => (
                  <Input
                    key={field.id}
                    label={field.label}
                    type="text"
                    placeholder={field.placeholder}
                    name={field.id}
                    id={field.id}
                    required={true}
                    containerClassName="w-full lg:ml-11"
                  />
                ))}
              </div>
            </div>
            <div className="emailAndPhone-container flex flex-col gap-3 md:gap-4 mb-4 mx-0 lg:mx-0 lg:flex-row">
              {formFields.emailAndPhone.map((field) => (
                <Input
                  key={field.id}
                  label={field.label}
                  type="text"
                  placeholder={field.placeholder}
                  name={field.id}
                  id={field.id}
                  required={true}
                  containerClassName="w-full"
                />
              ))}
            </div>
            <div className="button-container flex flex-col justify-between gap-2 md:gap-3 pb-6 lg:flex-row lg:justify-end lg:items-center">
              <Button
                label="Cancel"
                className="text-light-gray flex-1 lg:flex-0 hover:text-red hover:border-red"
              />
              <Button
                label="Save Changes"
                className="text-white bg-light-gray flex-1 lg:flex-0 hover:bg-red hover:border-red lg:whitespace-nowrap"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
