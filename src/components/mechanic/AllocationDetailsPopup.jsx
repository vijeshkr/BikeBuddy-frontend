import React, { useEffect } from 'react';

const AllocationDetailsPopup = ({ close, allocation }) => {

    return (
        <div className="fixed p-5 xs:p-10 inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-5 xs:p-10 rounded-xl shadow-xl w-full max-w-md h-full relative overflow-y-auto scrollbar-none">
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
                    <span className="ml-4 text-gray-700">{allocation.bookingId?.customerId?.name}</span>
                </div>
                {/* Customer vehicle */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base">Vehicle:</span>
                    <span className="ml-4 text-gray-700">{allocation.bookingId?.vehicleId?.registrationNumber}</span>
                </div>
                {/* Place */}
                {
                    allocation.bookingId?.place &&
                    <div className="mb-4">
                        <span className="font-semibold text-text-sm sm:text-base">Place:</span>
                        <span className="ml-4 text-gray-700">{allocation.bookingId?.place}</span>
                    </div>
                }
                {/* Phone */}
                {
                    allocation.bookingId?.phone &&
                    <div className="mb-4">
                        <span className="font-semibold text-text-sm sm:text-base">Phone:</span>
                        <span className="ml-4 text-gray-700">{allocation.bookingId?.phone}</span>
                    </div>
                }
                {/* Service type */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Service Type:</span>
                    <span className="ml-4 text-gray-700">{allocation.bookingId?.breakdown ? 'Breakdown' : allocation.bookingId?.serviceType?.packageName}</span>
                </div>
                {/* Booking date */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Booking Date:</span>
                    <span className="ml-4 text-gray-700">{new Date(allocation.bookingId?.bookingDate).toLocaleDateString()}</span>
                </div>
                {/* Job description */}
                <div className="mb-4 max-w-[450px]">
                    <span className="font-semibold text-text-sm sm:text-base underline">Job Description:</span>
                    <div className=" text-gray-700">{allocation.bookingId?.description}</div>
                </div>
                {/* Extra work request details */}
                {allocation.extraWorkDescription &&
                    <div>
                        <div className="mb-4 max-w-[450px]">
                            <span className="font-semibold text-text-sm sm:text-base underline">Work Request Description:</span>
                            <div className=" text-gray-700">{allocation.extraWorkDescription}</div>
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold text-text-sm sm:text-base ">Extra estimation amount:</span>
                            <span className=" text-gray-700 ml-4">{allocation.extraWorkEstimationAmount}</span>
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold text-text-sm sm:text-base ">Customer Approval Status:</span>
                            <span className={`ml-4 ${allocation.customerApproval === 'Pending' ? 'text-yellow-500' :
                                allocation.customerApproval === 'Approved' ? 'text-green-600' : 'text-red-600'}
                            }`}>{allocation.customerApproval}</span>
                        </div>
                    </div>
                }
                {/* Status */}
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Status:</span>
                    <span
                        className={`ml-4 ${allocation.bookingId?.status === 'Unallocated' ? 'text-gray-500'
                            : allocation.bookingId?.status === 'Pending' ? 'text-yellow-500'
                                : allocation.bookingId?.status === 'Cancelled' ? 'text-red-600'
                                    : allocation.bookingId?.status === 'Completed' ? 'text-green-600'
                                        : allocation.bookingId?.status === 'Allocated' ? 'text-blue-400'
                                            : 'text-gray-600'
                            }`}
                    >
                        {allocation.bookingId?.status}
                    </span>
                </div>

            </div>
        </div>

    )
}

export default AllocationDetailsPopup;