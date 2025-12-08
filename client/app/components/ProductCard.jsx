import Image from "next/image"

export default function ProductCard() {
  return (
    <>
    <div className="cursor-pointer hover:shadow-2xl transition-shadow w-[519px] rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-start items-start">
    <Image width={519} height={327} className="rounded-tl-xl rounded-tr-xl" src="/pictures/product_card_photo.png" alt="product card image"/>
    <div className="self-stretch px-5 py-4 flex flex-col justify-start items-start gap-6">
        <div className="w-[468px] inline-flex justify-between items-center">
            <div className="justify-start"><span className="text-sky-800 text-xl font-semibold font-['Montserrat'] leading-6">₱000</span><span className="text-black text-2xl font-semibold font-['Montserrat'] leading-6"> </span><span className="text-black text-base font-medium font-['Montserrat'] leading-6">/day</span></div>
            <div className="justify-start text-zinc-800 text-sm font-normal font-['Montserrat'] leading-6">Category</div>
        </div>
        <div className="justify-start text-black text-2xl font-semibold font-['Montserrat'] leading-6">Name of Product</div>
        <div className="self-stretch justify-start text-black text-sm font-normal font-['Montserrat'] leading-6">Description of Product - Placeholders</div>
        <div className="inline-flex justify-start items-center gap-3.5">
            <Image width={54} height={54} className="rounded-full" src="/pictures/sample-pfp-productCard.png" alt="profile photo image" />
            <div className="w-52 inline-flex flex-col justify-start items-start">
                <div className="self-stretch justify-start text-black text-xl font-semibold font-['Montserrat'] leading-6">Rental Owner Name</div>
                <div className="self-stretch justify-start text-zinc-800 text-base font-normal font-['Montserrat'] leading-6">Rental Owner</div>
            </div>
        </div>
    </div>
</div>
    </>
  )
}