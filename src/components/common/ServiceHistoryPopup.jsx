import React from 'react';

const ServiceHistoryPopup = ({ close, history }) => {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full relative">
                <button
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                    onClick={close}
                >
                    &times;
                </button>
                <h2 className="text-xl sm:text-2xl text-center font-semibold mb-6 ">Service History</h2>
                {/* Customer name */}
                <div className="mb-4">
                    <span className="font-semibold text-sm sm:text-base ">Customer:</span>
                    <span className="ml-4 text-gray-700">{history?.allocation?.bookingId?.customerId?.name}</span>
                </div>
                {/* Customer vehicle */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base">Vehicle:</span>
                    <span className="ml-4 text-gray-700">{history?.allocation?.bookingId?.vehicleId?.registrationNumber}</span>
                </div>
                {/* Service type */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Service Type:</span>
                    <span className="ml-4 text-gray-700">{history?.allocation?.bookingId?.breakdown ? 'Breakdown' : history?.allocation?.bookingId?.serviceType?.packageName}</span>
                </div>
                {/* Place */}
                {
                    history?.allocation?.bookingId?.place &&
                    <div className="mb-4">
                        <span className="font-semibold text-text-sm sm:text-base">Place:</span>
                        <span className="ml-4 text-gray-700">{history?.allocation?.bookingId?.place}</span>
                    </div>
                }
                {/* Phone */}
                {
                    history?.allocation?.bookingId?.phone &&
                    <div className="mb-4">
                        <span className="font-semibold text-text-sm sm:text-base">Phone:</span>
                        <span className="ml-4 text-gray-700">{history?.allocation?.bookingId?.phone}</span>
                    </div>
                }

                {/* Booking date */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Booking Date:</span>
                    <span className="ml-4 text-gray-700">{new Date(history?.allocation?.bookingId?.bookingDate).toLocaleDateString()}</span>
                </div>
                {/* Delivered date */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Delivered Date:</span>
                    <span className="ml-4 text-gray-700">{new Date(history?.updatedAt).toLocaleDateString()}</span>
                </div>
                {/* Job description */}
                <div className="mb-4 max-w-[450px]">
                    <span className="font-semibold text-text-sm sm:text-base ">Job Description:</span>
                    <span className="ml-4 text-gray-700">{history?.allocation?.bookingId?.description}</span>
                </div>

                {/* Mechanic */}
                {
                    <div className="mb-4">
                        <span className="font-semibold text-text-sm sm:text-base">Mechanic:</span>
                        <span className="ml-4 text-gray-700">{history?.allocation?.mechanicId?.name}</span>
                    </div>
                }
                {/* Next service advice */}
                {
                    <div className="mb-4">
                        <span className="font-semibold text-text-sm sm:text-base">Service Advice:</span>
                        <span className="ml-4 text-gray-700">{history?.allocation?.serviceAdvice}</span>
                    </div>
                }
            </div>
        </div>

    )
}

export default ServiceHistoryPopup;