import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentBookings } from '../../redux/features/currentBookingSlice';

/**
 * CurrentBookings Component
 * 
 * This component fetches and displays the current active bookings for a customer.
 * The bookings are displayed in a table format for larger screens and card format for mobile.
 * 
 * @returns 
 */

const CurrentBookings = () => {
    // Access user details from the Redux store
    const user = useSelector((state) => state.user.user);
    const customerId = user._id;
    const dispatch = useDispatch();

    // Access bookings from the Redux store
    const bookings = useSelector((state) => state.currentBookings.currentBookings)

    // Function to fetch the current bookings from the backend
    const fetchBookings = async () => {
        try {
            const response = await makeRequest.get(`/get-current-booking/${customerId}`);
            if (response.data.success) {
                dispatch(setCurrentBookings({ currentBookings: response.data.data}))
            }
        } catch (error) {
            console.error('Error fetching current bookings: ', error);
        }
    };

    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchBookings();
    }, []);

    // Handle booking cancellation
    const handleCancel = async (bookingId) => {
        try {
            const response = await makeRequest.patch(`/cancel-booking/${bookingId}`);
            if (response.data.success) {
                toast.success('Booking cancelled successfully');
                fetchBookings();
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
        }
    };

    return (
        <div className="p-2 shadow-custom rounded-md min-w-[320px]">
            <h3 className="text-2xl font-semibold mb-4">Current Bookings</h3>
            {bookings.length === 0 ? (
                <p className="text-gray-500">No current bookings available.</p>
            ) : (
                <div>
                    {/* Table format for larger screens */}
                    <table className="hidden min-w-[520px] lg:table w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-2 px-4 border-b font-medium">Vehicle</th>
                                <th className="py-2 px-4 border-b font-medium">Service Type</th>
                                <th className="py-2 px-4 border-b font-medium">Status</th>
                                <th className="py-2 px-4 border-b font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{booking.vehicleId.registrationNumber}</td>
                                    <td className="py-2 px-4 border-b">{booking.serviceType.packageName}</td>
                                    <td className={`py-2 px-4 border-b 
                                        ${booking.status === 'Unallocated' && 'text-gray-400'}
                                        ${booking.status === 'Pending' && 'text-yellow-400'}
                                        ${booking.status === 'Cancelled' && 'text-red-600'}
                                        ${booking.status === 'Completed' && 'text-green-600'}`}>{booking.status}</td>
                                    <td className="py-2 px-4 border-b text-gray-400">
                                        {booking.status === 'Unallocated' ? (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                                            >
                                                Cancel
                                            </button>
                                        ) : 'No action'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Card format for mobile devices */}
                    <div className="lg:hidden">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
                                <div className="mb-2">
                                    <strong>Vehicle:</strong> {booking.vehicleId.registrationNumber}
                                </div>
                                <div className="mb-2">
                                    <strong>Service Type:</strong> {booking.serviceType.packageName}
                                </div>
                                <div className={`mb-2
                                    ${booking.status === 'Unallocated' && 'text-gray-400'}
                                    ${booking.status === 'Pending' && 'text-yellow-400'}
                                    ${booking.status === 'Cancelled' && 'text-red-600'}
                                    ${booking.status === 'Completed' && 'text-green-600'}`}>
                                    <strong>Status:</strong> {booking.status}
                                </div>
                                <div className="text-right">
                                    {booking.status === 'Unallocated' ? (
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                                        >
                                            Cancel
                                        </button>
                                    ) : (
                                        <span className="text-gray-500">No action</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentBookings;
