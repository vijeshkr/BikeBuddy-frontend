import React from 'react';
import { useSelector } from 'react-redux';

const MechanicAllocations = () => {

    // Access allocation details from the Redux store
    const allocations = useSelector((state) => state.allocations.allocations);
    const handleSelectedBooking = (bookingId) => {
        console.log(bookingId)
    };

    const openHandleBookingDetails = () => {
        console.log('first')
    };

    const openHandleAllocate = () => {
        console.log('first')
    };

    return (
        <div className="p-2 lg:shadow-custom rounded-md">
            <h3 className="text-xl sm:text-2xl text-center sm:text-left font-semibold mb-4">Mechanic Allocations</h3>
            {allocations.length === 0 ? (
                <p className="text-gray-500">No allocations available.</p>
            ) : (
                <div>
                    {/* Table format for larger screens */}
                    <table className="hidden lg:table w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allocations.map((allocation) => (
                                <tr key={allocation._id} className="hover:bg-gray-50">
                                    <td
                                        onClick={() => {
                                            handleSelectedBooking(allocation.bookingId._id);
                                            openHandleBookingDetails();
                                        }}
                                        className="px-4 py-3 cursor-pointer">
                                        {allocation?.bookingId?.vehicleId?.registrationNumber}
                                    </td>
                                    <td className={`px-4 py-3 ${allocation.bookingId.breakdown && 'text-red-600'}`}>
                                        {allocation.bookingId?.breakdown ? 'Breakdown' : allocation.bookingId?.serviceType?.packageName}
                                    </td>
                                    <td className="px-4 py-3">
                                        {new Date(allocation.bookingId.bookingDate).toLocaleDateString()}
                                    </td>
                                    <td className={`px-4 py-3
                                        ${allocation.bookingId.status === 'Unallocated' && 'text-gray-400'}
                                        ${allocation.bookingId.status === 'Allocated' && 'text-blue-400'}
                                        ${allocation.bookingId.status === 'Pending' && 'text-yellow-400'}
                                        ${allocation.bookingId.status === 'Cancelled' && 'text-red-600'}
                                        ${allocation.bookingId.status === 'Completed' && 'text-green-600'}`}>
                                        {allocation.bookingId.status}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => {
                                                if (allocation.bookingId.status !== 'Cancelled') {
                                                    handleSelectedBooking(allocation.bookingId._id);
                                                    openHandleAllocate();
                                                }
                                            }}
                                            className={`bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500 transition duration-300
                                            ${allocation.bookingId.status === 'Completed' ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                                            {allocation.bookingId.status === 'Unallocated' ? 'Allocate' :
                                                allocation.bookingId.status === 'Completed' ? 'Billing' :
                                                    'No Action'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Card format for mobile devices */}
                    <div className="lg:hidden">
                        {allocations.map((allocation) => (
                            <div key={allocation._id} className="bg-white text-sm sm:text-base shadow-custom rounded-lg p-4 mb-4 border border-gray-200">
                                <div className="mb-2">
                                    <span className="font-medium">Vehicle:</span> {allocation.bookingId?.vehicleId?.registrationNumber}
                                </div>
                                <div className={`mb-2 ${allocation.bookingId.breakdown && 'text-red-600'}`}>
                                    <span className="font-medium text-black">Service Type:</span> {allocation.bookingId.breakdown ? 'Breakdown' : allocation.bookingId.serviceType?.packageName}
                                </div>
                                <div className="mb-2">
                                    <span className="font-medium">Booking Date:</span> {new Date(allocation.bookingId.bookingDate).toLocaleDateString()}
                                </div>
                                <div className={`mb-2
                                    ${allocation.bookingId.status === 'Unallocated' && 'text-gray-400'}
                                    ${allocation.bookingId.status === 'Allocated' && 'text-blue-400'}
                                    ${allocation.bookingId.status === 'Pending' && 'text-yellow-400'}
                                    ${allocation.bookingId.status === 'Cancelled' && 'text-red-600'}
                                    ${allocation.bookingId.status === 'Completed' && 'text-green-600'}`}>
                                    <span className="font-medium text-black">Status:</span> {allocation.bookingId.status}
                                </div>
                                <div className="mb-2 flex justify-between items-start">
                                    <div>
                                        <span className="font-medium text-black">Mechanic:</span>
                                        <span
                                            onClick={() => {
                                                if (allocation.bookingId.status !== 'Cancelled') {
                                                    handleSelectedBooking(allocation.bookingId._id);
                                                    openHandleAllocate();
                                                }
                                            }}
                                            className={`px-1.5 cursor-pointer
                                                ${allocation.bookingId.status === 'Unallocated' && 'text-gray-400'}
                                                ${allocation.bookingId.status === 'Allocated' && 'text-blue-400'}
                                                ${allocation.bookingId.status === 'Pending' && 'text-yellow-400'}
                                                ${allocation.bookingId.status === 'Cancelled' && 'text-gray-400'}
                                                ${allocation.bookingId.status === 'Completed' && 'text-green-600'}`}>
                                            {allocation.bookingId.status === 'Cancelled' ? 'Cancelled' : 'Allocate'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (allocation.bookingId.status !== 'Cancelled') {
                                                handleSelectedBooking(allocation.bookingId._id);
                                                openHandleAllocate();
                                            }
                                        }}
                                        className={`bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500 transition duration-300
                                            ${allocation.bookingId.status === 'Completed' ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                                        {allocation.bookingId.status === 'Unallocated' ? 'Allocate' :
                                            allocation.bookingId.status === 'Completed' ? 'Billing' :
                                                'No Action'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MechanicAllocations;