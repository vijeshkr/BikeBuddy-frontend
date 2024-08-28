import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import AllocationPopup from './AllocationPopup';

/**
 * AllBookings Component
 * 
 * This component fetches and displays all bookings for an admin.
 * The bookings are displayed in a table format for larger screens and card format for mobile.
 * Only users with an 'admin' role can access this component.
 * 
 * @returns 
 */

const AllBookings = () => {
    // Local state to store bookings
    const [bookings, setBookings] = useState([]);
    // State to open/close handle allocation popup
    const [openAllocate, setOpenAllocate] = useState(false)
    // State to manage selected booking
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Function to fetch all bookings from the backend
    const fetchBookings = async () => {
        try {
            const response = await makeRequest.get('/get-all-booking');
            if (response.data.success) {
                setBookings(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching all bookings: ', error);
        }
    };

    // Handle open allocate popup
    const openHandleAllocate = () => {
        setOpenAllocate((prev) => !prev);
    };

    // Handle close allocate popup
    const closeHandleAllocate = () => {
        setOpenAllocate((prev) => !prev);
    };

    // Handle selected booking
    const handleSelectedBooking = (bookingId) => {
        const booking = bookings.find(booking => booking._id === bookingId);
        setSelectedBooking(booking);
    };


    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="p-2 shadow-custom rounded-md min-w-[320px]">
            <h3 className="text-xl sm:text-2xl text-center sm:text-left font-semibold mb-4">All Bookings</h3>
            {bookings.length === 0 ? (
                <p className="text-gray-500">No bookings available.</p>
            ) : (
                <div>
                    {/* Table format for larger screens */}
                    <table className="hidden min-w-[520px] lg:table w-full divide-y divide-gray-200">
                        <thead className='bg-gray-50'>
                            <tr className="text-left">
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mechanic</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{booking.customerId.name}</td>
                                    <td className="px-4 py-3">{booking.vehicleId.registrationNumber}</td>
                                    <td className="px-4 py-3">{booking.serviceType.packageName}</td>
                                    <td className="px-4 py-3">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                    <td className={`px-4 py-3 
                                        ${booking.status === 'Unallocated' && 'text-gray-400'}
                                        ${booking.status === 'Allocated' && 'text-blue-400'}
                                        ${booking.status === 'Pending' && 'text-yellow-400'}
                                        ${booking.status === 'Cancelled' && 'text-red-600'}
                                        ${booking.status === 'Completed' && 'text-green-600'}`}>
                                        {booking.status}
                                    </td>
                                    <td
                                        onClick={() => {
                                            if (!booking.allocation && booking.status !== 'Cancelled') {
                                                handleSelectedBooking(booking._id);
                                                openHandleAllocate();
                                            }
                                        }}
                                        className={`px-4 py-3 ${!booking.allocation ? `${booking.status !== 'Cancelled' ? 'cursor-pointer text-black' : 'text-red-600'}` : 'text-blue-400'}`}>
                                        {booking.allocation ? booking.allocation.mechanicId.name : `${booking.status !== 'Cancelled' ? 'Allocate' : 'Cancelled'}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Card format for mobile devices */}
                    <div className="lg:hidden">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white text-sm sm:text-base shadow-custom rounded-lg p-4 mb-4 border border-gray-200">
                                <div className="mb-2">
                                    <span className='font-medium'>Customer:</span> {booking.customerId.name}
                                </div>
                                <div className="mb-2">
                                    <span className='font-medium'>Vehicle:</span> {booking.vehicleId.registrationNumber}
                                </div>
                                <div className="mb-2">
                                    <span className='font-medium'>Service Type:</span> {booking.serviceType.packageName}
                                </div>
                                <div className="mb-2">
                                    <span className='font-medium'>Booking Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}
                                </div>
                                <div className={`mb-2
                                    ${booking.status === 'Unallocated' && 'text-gray-400'}
                                    ${booking.status === 'Allocated' && 'text-blue-400'}
                                    ${booking.status === 'Pending' && 'text-yellow-400'}
                                    ${booking.status === 'Cancelled' && 'text-red-600'}
                                    ${booking.status === 'Completed' && 'text-green-600'}`}>
                                    <span className='font-medium text-black'>Status:</span> {booking.status}
                                </div>
                                <div className={`mb-2`}>
                                    <span className='font-medium text-black'>Mechanic:</span>
                                    <span
                                        onClick={() => {
                                            if (!booking.allocation && booking.status !== 'Cancelled') {
                                                handleSelectedBooking(booking._id);
                                                openHandleAllocate();
                                            }
                                        }}
                                        className={`px-1.5
                                    ${!booking.allocation ? `${booking.status !== 'Cancelled' ? 'cursor-pointer text-black' : 'text-red-600'}` : 'text-blue-400'}
                                    ${booking.status === 'Unallocated' && 'text-gray-400'}
                                    ${booking.status === 'Allocated' && 'text-blue-400'}
                                    ${booking.status === 'Pending' && 'text-yellow-400'}
                                    ${booking.status === 'Cancelled' && 'text-gray-400'}
                                    ${booking.status === 'Completed' && 'text-green-600'}`}
                                    >
                                        {booking.allocation ? booking.allocation.mechanicId.name : `${booking.status !== 'Cancelled' ? 'Allocate' : 'Cancelled'}`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {openAllocate && <AllocationPopup close={closeHandleAllocate} booking={selectedBooking} fetchBookings={fetchBookings} />}
        </div>
    );
};

export default AllBookings;
