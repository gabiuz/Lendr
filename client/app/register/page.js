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
        <div className="z-10 absolute bottom-0 right-0">
          <Form className="login">
            <div className="bg-white px-24! pt-[113px]! mr-[150px]!">
              <div className="red-line mx-auto! mb-[72px]!"></div>
              <h1 className="text-[64px]! font-bold text-black mt-0! mb-3 w-fit">
                Create an Account<span className="m-0 p-0 text-red">.</span>
              </h1>
              <p className="text-base text-black mb-11!">
                Already have an Account?
                <Link href="" className="font-bold">
                  <span> Log in</span>
                </Link>
              </p>
              <div className="Name flex gap-8! mb-[30px]!">
                <div className="fname-container flex flex-col border border-lightgray w-60 rounded-xl px-[25px]! py-3!">
                  <label
                    htmlFor="FirstName"
                    className="text-black mb-2! text-sm!"
                  >
                    First Name<span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Jedia"
                    className="text-black outline-0"
                    name="FirstName"
                  ></input>
                </div>
                <div className="mname-container flex flex-col border border-lightgray w-60 rounded-xl px-[25px]! py-3! ">
                  <label
                    htmlFor="MiddleName"
                    className="text-black mb-2! text-sm!"
                  >
                    Middle Name<span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Velasco"
                    className="text-black outline-0"
                    name="MiddleName"
                  ></input>
                </div>
                <div className="lname-container flex flex-col border border-lightgray w-60 rounded-xl px-[25px]! py-3!">
                  <label
                    htmlFor="LastName"
                    className="text-black mb-2! text-sm!"
                  >
                    Last Name<span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Sagun"
                    className="text-black outline-0"
                    name="LastName"
                  ></input>
                </div>
              </div>
              <div className="bday-radio-container flex justify-between items-center mb-[30px]!">
                <div className="radio-container">
                  <label className="text-black mb-1.5">
                    Sex<span className="text-red">*</span>
                  </label>
                  <div className="flex w-fit gap-[21px]! justify-center align-center">
                    <div className="male flex gap-[7px]!">
                      <input
                        type="radio"
                        name="Sex"
                        id="Male"
                        value="Male"
                      ></input>
                      <label htmlFor="Male" className="text-black text-sm">
                        Male
                      </label>
                    </div>
                    <div className="female flex gap-[7px]!">
                      <input
                        type="radio"
                        name="Sex"
                        id="Female"
                        value="Female"
                      ></input>
                      <label htmlFor="Female" className="text-black text-sm">
                        Female
                      </label>
                    </div>
                    <div className="other flex gap-[7px]!">
                      <input
                        type="radio"
                        name="Sex"
                        id="Other"
                        value="Other"
                      ></input>
                      <label htmlFor="Other" className="text-black text-sm">
                        Prefer Not to Say
                      </label>
                    </div>
                  </div>
                </div>
                <div className="birthday-container flex flex-col border border-lightgray w-[381px]! rounded-xl px-[25px]! py-3!">
                  <label htmlFor="bday" className="text-black text-sm mb-2!">
                    Birthday <span className="text-red">*</span>
                  </label>
                  <input
                    type="date"
                    className="outline-0 text-light-gray"
                  ></input>
                </div>
              </div>
              <div className="email-phone flex justify-between mb-11!">
                <div className="email-container flex flex-col border border-lightgray w-[381px]! rounded-xl px-[25px]! py-3!">
                  <label htmlFor="email" className="text-black text-sm mb-2!">
                    Email<span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Abcde@gmail.com"
                    name="email"
                    id="email"
                    className="text-black outline-0"
                  ></input>
                </div>
                <div className="phone-container flex flex-col border border-lightgray w-[381px]! rounded-xl px-[25px]! py-3!">
                  <label htmlFor="phone" className="text-black text-sm mb-2!">
                    Phone Number<span className="text-red">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="09123456789"
                    name="number"
                    id="number"
                    className="text-black outline-0"
                  ></input>
                </div>
              </div>
              <div className="address-container flex flex-col border border-lightgray w-full rounded-xl px-[25px]! py-3! mb-[50px]!">
                <label htmlFor="address" className="text-black text-sm mb-2!">
                  Address<span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  className="text-black outline-0"
                  id="address"
                  name="address"
                  placeholder="123 St. Metro Manila"
                ></input>
              </div>
              <div className="button-container flex flex-row justify-end gap-[15px]! pb-[113px]!">
                <button className="text-light-gray font-semibold border-2 border-light-gray px-[26px]! py-2.5! rounded-[11px]! cursor-pointer">
                  Cancel
                </button>
                <button className=" text-white bg-light-gray font-semibold border-2 border-light-gray px-[26px]! py-2.5! rounded-[11px]! cursor-pointer">
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
