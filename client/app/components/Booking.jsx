'use client';

export default function Booking({ isOpen = false, onClose = () => {} }) {
    return (
        <>
            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
                    onClick={onClose}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-fit max-w-lg mx-auto overflow-hidden animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-container py-24 px-28">
                            <div className="red-line mx-auto"></div>
                            <div className="modal-header flex justify-between items-center">
                                <h1 className="text-4xl font-extrabold w-full mt-11">Booking Page</h1>
                            </div>
                            <div className="modal-body grid grid-cols-2 gap-6 mt-6">
                                <div className="column-1">
                                    <p>Left Column Content</p>
                                </div>
                                <div className="column-2">
                                    <p>Right Column Content</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}