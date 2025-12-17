import Image from "next/image";

export default function Review() {
    return (
<div className="mt-16 px-6 py-6 rounded-xl border border-zinc-300 flex flex-col gap-4">
    <div className="text-black text-lg font-semibold">Reviews</div>
    <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
        <div className="p-3 bg-white rounded-lg border border-zinc-300 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <Image width={40} height={40} className="w-10 h-10 rounded-full" src="/pictures/sample-pfp-productCard.png" alt="Image"/>
                    <div className="flex flex-col">
                        <div className="text-black text-base font-semibold">Mika S.</div>
                        <div className="text-zinc-600 text-xs">2025/09/15</div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="text-zinc-800 text-sm">4.5</div>
                    <div className="flex items-center gap-0.5">
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                    </div>
                </div>
            </div>
            <p className="text-black text-sm">&quot;Booking was easy and the owner was very responsive. The camera arrived earlier than expected and was in perfect condition. Will definitely rent again!&quot;</p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-zinc-300 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <Image width={40} height={40} className="w-10 h-10 rounded-full" src="/pictures/sample-pfp-productCard.png" alt="Image" />
                    <div className="flex flex-col">
                        <div className="text-black text-base font-semibold">Mika S.</div>
                        <div className="text-zinc-600 text-xs">2025/09/15</div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="text-zinc-800 text-sm">4.5</div>
                    <div className="flex items-center gap-0.5">
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                    </div>
                </div>
            </div>
            <p className="text-black text-sm">&quot;Camera is like brand new! I used the EOS 90D for a client shoot and it performed flawlessly. Everything was clean, complete, and well-maintained. Highly recommended for creatives!&quot;</p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-zinc-300 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <Image width={40} height={40} className="w-10 h-10 rounded-full" src="/pictures/sample-pfp-productCard.png" alt="Image" />
                    <div className="flex flex-col">
                        <div className="text-black text-base font-semibold">Mika S.</div>
                        <div className="text-zinc-600 text-xs">2025/09/15</div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="text-zinc-800 text-sm">4.5</div>
                    <div className="flex items-center gap-0.5">
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                        <div className="w-3 h-3 bg-yellow-500" />
                    </div>
                </div>
            </div>
            <p className="text-black text-sm">&quot;Booking was easy and the owner was very responsive. The camera arrived earlier than expected and was in perfect condition. Will definitely rent again!&quot;</p>
        </div>
    </div>
</div>
    );
}