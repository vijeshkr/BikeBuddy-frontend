import React from 'react';

const BookingDetailsPopup = ({ close, booking }) => {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full relative">
                <button
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                    onClick={close}
                >
                    &times;
                </button>
                <h2 className="text-xl sm:text-2xl text-center font-semibold mb-6 ">Booking Details</h2>
                {/* Customer name */}
                <div className="mb-4">
                    <span className="font-semibold text-sm sm:text-base ">Customer:</span>
                    <span className="ml-4 text-gray-700">{booking.customerId.name}</span>
                </div>
                {/* Customer vehicle */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base">Vehicle:</span>
                    <span className="ml-4 text-gray-700">{booking.vehicleId.registrationNumber}</span>
                </div>
                {/* Place */}
                {
                    booking.place &&
                    <div className="mb-4">
                        <span className="font-semibold text-text-sm sm:text-base">Place:</span>
                        <span className="ml-4 text-gray-700">{booking.place}</span>
                    </div>
                }
                {/* Phone */}
                {
                    booking.phone &&
                    <div className="mb-4">
                        <span className="font-semibold text-text-sm sm:text-base">Phone:</span>
                        <span className="ml-4 text-gray-700">{booking.phone}</span>
                    </div>
                }
                {/* Service type */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Service Type:</span>
                    <span className="ml-4 text-gray-700">{booking.breakdown ? 'Breakdown' : booking.serviceType?.packageName}</span>
                </div>
                {/* Booking date */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Booking Date:</span>
                    <span className="ml-4 text-gray-700">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
                                {/* Job description */}
                                <div className="mb-4 max-w-[450px]">
                    <span className="font-semibold text-text-sm sm:text-base ">Job Description:</span>
                    <span className="ml-4 text-gray-700">{booking.description}</span>
                </div>
                {/* Status */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Status:</span>
                    <span
                        className={`ml-4 ${booking.status === 'Unallocated' ? 'text-gray-500'
                            : booking.status === 'Pending' ? 'text-yellow-500'
                                : booking.status === 'Cancelled' ? 'text-red-600'
                                    : booking.status === 'Completed' ? 'text-green-600'
                                        : booking.status === 'Allocated' ? 'text-blue-400'
                                            : 'text-gray-600'
                            }`}
                    >
                        {booking.status}
                    </span>
                </div>
                {/* Mechanic */}
                {
                    booking.status === 'Allocated' &&
                    <div className="mb-4">
                        <span className="font-semibold text-text-sm sm:text-base">Mechanic:</span>
                        <span className="ml-4 text-gray-700">{booking.allocation.mechanicId.name}</span>
                    </div>
                }
            </div>
        </div>

    )
}

export default BookingDetailsPopup;