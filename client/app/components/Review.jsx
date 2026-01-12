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
                                    <img width={40} height={40} className="w-10 h-10 rounded-full" src={r.customer?.avatar || '/pictures/sample-pfp-productCard.png'} alt={r.customer?.name || 'Reviewer'} />
                                    <div className="flex flex-col">
                                        <div className="text-black text-base font-semibold">{r.customer?.name || 'Anonymous'}</div>
                                        <div className="text-zinc-600 text-xs">{r.created_at}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="text-zinc-800 text-sm">{r.rating}</div>
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <svg
                                                key={`${r.review_id}-star-${i}`}
                                                width="12"
                                                height="12"
                                                viewBox="0 0 170 170"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={i < Math.round(r.rating) ? 'opacity-100' : 'opacity-30'}
                                            >
                                                <path
                                                    opacity="0.4"
                                                    d="M22.764 64.7857L50.2297 92.2514C52.1422 94.1639 53.0453 96.8998 52.6203 99.5826L46.5375 137.939L81.175 120.328C83.5922 119.106 86.4609 119.106 88.8781 120.328L123.489 137.939L117.433 99.5826C117.008 96.8998 117.884 94.1639 119.823 92.2514L147.262 64.7592L108.906 58.6498C106.223 58.2248 103.912 56.5514 102.664 54.1076L85.0265 19.5498L67.3625 54.1342C66.1406 56.5514 63.8031 58.2514 61.1203 58.6764L22.764 64.7857Z"
                                                    fill="#FFBB00"
                                                />
                                                <path
                                                    d="M110.234 50.2828L90.7109 11.9797C89.6219 9.85469 87.4172 8.5 85.0266 8.5C82.6359 8.5 80.4313 9.85469 79.3422 11.9797L59.7922 50.2828L17.3188 57.0297C14.9547 57.4016 12.9891 59.075 12.2453 61.3594C11.5016 63.6437 12.1125 66.1406 13.7859 67.8406L44.1734 98.2547L37.4797 140.728C37.1078 143.092 38.0906 145.483 40.0297 146.891C41.9688 148.298 44.5188 148.511 46.6703 147.422L85.0266 127.925L123.356 147.422C125.481 148.511 128.058 148.298 129.997 146.891C131.936 145.483 132.919 143.119 132.547 140.728L125.827 98.2547L156.214 67.8406C157.914 66.1406 158.498 63.6437 157.755 61.3594C157.011 59.075 155.072 57.4016 152.681 57.0297L110.234 50.2828ZM108.906 58.6766L147.263 64.7859L119.823 92.2781C117.911 94.1906 117.008 96.9266 117.433 99.6094L123.489 137.939L88.8781 120.328C86.4609 119.106 83.5922 119.106 81.175 120.328L46.5375 137.939L52.5938 99.5828C53.0188 96.9 52.1422 94.1641 50.2031 92.2516L22.7641 64.7594L61.1203 58.65C63.8031 58.225 66.1141 56.5516 67.3625 54.1078L85.0266 19.55L102.664 54.1344C103.886 56.5516 106.223 58.2516 108.906 58.6766Z"
                                                    fill="#FFBB00"
                                                />
                                            </svg>
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