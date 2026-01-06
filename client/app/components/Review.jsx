import Image from "next/image";

export default function Review({ reviews = [] }) {
    return (
        <div className="mt-16 px-6 py-6 rounded-xl border border-zinc-300 flex flex-col gap-4">
            <div className="text-black text-lg font-semibold">Reviews</div>
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                {reviews.length === 0 ? (
                    <div className="p-3 text-zinc-600">No reviews yet.</div>
                ) : (
                    reviews.map((r) => (
                        <div key={r.review_id} className="p-3 bg-white rounded-lg border border-zinc-300 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2.5">
                                    <Image width={40} height={40} className="w-10 h-10 rounded-full" src={r.customer?.avatar || '/pictures/sample-pfp-productCard.png'} alt={r.customer?.name || 'Reviewer'} />
                                    <div className="flex flex-col">
                                        <div className="text-black text-base font-semibold">{r.customer?.name || 'Anonymous'}</div>
                                        <div className="text-zinc-600 text-xs">{r.created_at}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="text-zinc-800 text-sm">{r.rating}</div>
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className={`w-3 h-3 ${i < Math.round(r.rating) ? 'bg-yellow-500' : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-black text-sm">{r.comment || ''}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}