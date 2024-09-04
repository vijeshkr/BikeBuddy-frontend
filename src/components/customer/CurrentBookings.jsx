import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentBookings, updateBookingStatus } from '../../redux/features/currentBookingSlice';
import CustomerWorkApproval from './CustomerWorkApproval';
import PaymentPopup from '../../components/customer/PaymentPopup';

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
                dispatch(setCurrentBookings({ currentBookings: response.data.data }))
            }
        } catch (error) {
            console.error('Error fetching current bookings: ', error);
        }
    };

    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchBookings();
    }, []);


    // Handle booking cancel confirmation popup
    const handleBookingCancel = async (bookingId) => {
        try {
            // Show confirmation alert
            const confirm = await swal({
                title: 'Are you sure?',
                text: 'Do you want to cancel this booking?',
                icon: 'warning',
                buttons: ['Cancel', 'Yes, cancel it!'],
                dangerMode: true,
                className: 'swal-modal',
                didOpen: () => {
                    // Add custom classes to the elements
                    const swalTitle = document.querySelector('.swal-title');
                    const swalText = document.querySelector('.swal-text');
                    const swalButtonConfirm = document.querySelector('.swal-button--confirm');
                    const swalButtonCancel = document.querySelector('.swal-button--cancel');

                    if (swalTitle) swalTitle.classList.add('swal-title');
                    if (swalText) swalText.classList.add('swal-text');
                    if (swalButtonConfirm) swalButtonConfirm.classList.add('swal-button');
                    if (swalButtonCancel) swalButtonCancel.classList.add('swal-button');
                },
            });

            if (!confirm) return; // Exit if user cancels

            // Show a loading alert
            const loadingAlert = swal({
                title: 'Cancelling...',
                text: 'Please wait while we cancel your booking.',
                icon: 'info',
                buttons: false, // Disables buttons
                closeOnClickOutside: false,
                closeOnEsc: false,
                className: 'swal-modal',
                didOpen: () => {
                    // Add custom classes to the elements
                    const swalTitle = document.querySelector('.swal-title');
                    const swalText = document.querySelector('.swal-text');

                    if (swalTitle) swalTitle.classList.add('swal-title');
                    if (swalText) swalText.classList.add('swal-text');
                },
            });

            // API call
            const response = await makeRequest.patch(`/cancel-booking/${bookingId}`);

            if (response.data.success) {
                dispatch(updateBookingStatus(response.data.data));
            }

            // Close the loading alert
            swal.close();

            // Show success message
            await swal({
                title: 'Cancelled!',
                text: 'Your booking has been cancelled.',
                icon: 'success',
                className: 'swal-modal',
                didOpen: () => {
                    // Add custom classes to the elements
                    const swalTitle = document.querySelector('.swal-title');
                    const swalText = document.querySelector('.swal-text');
                    const swalButtonConfirm = document.querySelector('.swal-button--confirm');
                    const swalButtonCancel = document.querySelector('.swal-button--cancel');

                    if (swalTitle) swalTitle.classList.add('swal-title');
                    if (swalText) swalText.classList.add('swal-text');
                    if (swalButtonConfirm) swalButtonConfirm.classList.add('swal-button');
                    if (swalButtonCancel) swalButtonCancel.classList.add('swal-button');
                },
            });

        } catch (error) {
            // Close the loading alert if an error occurs
            swal.close();

            // Show error message
            await swal({
                title: 'Error!',
                text: 'There was an error cancelling your booking.',
                icon: 'error',
                className: 'swal-modal',
                didOpen: () => {
                    // Add custom classes to the elements
                    const swalTitle = document.querySelector('.swal-title');
                    const swalText = document.querySelector('.swal-text');
                    const swalButtonConfirm = document.querySelector('.swal-button--confirm');
                    const swalButtonCancel = document.querySelector('.swal-button--cancel');

                    if (swalTitle) swalTitle.classList.add('swal-title');
                    if (swalText) swalText.classList.add('swal-text');
                    if (swalButtonConfirm) swalButtonConfirm.classList.add('swal-button');
                    if (swalButtonCancel) swalButtonCancel.classList.add('swal-button');
                },
            });
        }
    };

    // State to manage customer approval popup
    const [approvalPopup, setApprovalPopup] = useState(false);
    // State to manage payment popup
    const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
    // State to manage current allocation
    const [currentAllocation, setCurrentAllocation] = useState({})

    // Handle open approval popup
    const handleOpenApproval = (allocation) => {
        setCurrentAllocation(allocation);
        setApprovalPopup(!approvalPopup);
    }

    // Handle close function for package popup
    const handleCloseApproval = () => {
        setCurrentAllocation({})
        setApprovalPopup(prev => !prev);
    }

    // Handle open payment popup
    const handleOpenPaymentPopup = (allocation) => {
        setCurrentAllocation(allocation);
        setOpenPaymentPopup(!approvalPopup);
    }

    // Handle close function for payment popup
    const handleClosePayment = () => {
        setCurrentAllocation({})
        setOpenPaymentPopup(prev => !prev);
    }


    return (
        <div className="p-2 shadow-custom rounded-md min-w-[320px]">
            <h3 className="text-xl sm:text-2xl text-center sm:text-left font-semibold mb-4">Current Bookings</h3>
            {bookings.length === 0 ? (
                <p className="text-gray-500">No current bookings available.</p>
            ) : (
                <div>
                    {/* Table format for larger screens */}
                    <table className="hidden min-w-[520px] lg:table w-full divide-y divide-gray-200">
                        <thead className='bg-gray-50'>
                            <tr className="text-left">
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{booking.vehicleId.registrationNumber}</td>
                                    <td className={`px-4 py-3 ${booking.breakdown && 'text-red-600'}`}>{booking.breakdown ? 'Breakdown' : booking.serviceType?.packageName}</td>
                                    <td className={`px-4 py-3 
                                        ${booking.status === 'Unallocated' && 'text-gray-400'}
                                        ${booking.status === 'Allocated' && 'text-blue-400'}
                                        ${booking.status === 'Pending' && 'text-yellow-400'}
                                        ${booking.status === 'Cancelled' && 'text-red-600'}
                                        ${booking.status === 'Completed' && 'text-green-600'}`}>{booking.status}</td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {booking.status === 'Unallocated' ? (
                                            <button
                                                onClick={() => handleBookingCancel(booking._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                                            >
                                                Cancel
                                            </button>
                                        )
                                            : booking.allocation.customerApproval === 'Pending' &&
                                                booking.status === 'Allocated' ||
                                                booking.status === 'Progress' ||
                                                booking.status === 'Pending' ?
                                                <button
                                                    onClick={() => {
                                                        handleOpenApproval(booking.allocation)
                                                    }}
                                                    className='bg-blue-400 px-3 py-1 text-white rounded hover:bg-blue-500'>
                                                    New Request
                                                </button>
                                                : booking.status === 'Unpaid' ?
                                                    <button
                                                        onClick={() => {
                                                            handleOpenPaymentPopup(booking.allocation);
                                                        }}
                                                        className='bg-green-400 px-3 py-1 text-white rounded hover:bg-green-500'>
                                                        Payment
                                                    </button>
                                                    : 'No action'}
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
                                    <span className='font-medium'>Vehicle:</span> {booking.vehicleId.registrationNumber}
                                </div>
                                <div className={`mb-2 ${booking.breakdown && 'text-red-600'}`}>
                                    <span className='font-medium text-black'>Service Type:</span> {booking.breakdown ? 'Breakdown' : booking.serviceType?.packageName}
                                </div>
                                <div className='flex justify-between'>
                                    <div className={`mb-2
                                    ${booking.status === 'Unallocated' && 'text-gray-400'}
                                    ${booking.status === 'Allocated' && 'text-blue-400'}
                                    ${booking.status === 'Pending' && 'text-yellow-400'}
                                    ${booking.status === 'Cancelled' && 'text-red-600'}
                                    ${booking.status === 'Completed' && 'text-green-600'}`}>
                                        <span className='font-medium text-black'>Status:</span> {booking.status}
                                    </div>
                                    <div className="text-right">
                                    {booking.status === 'Unallocated' ? (
                                            <button
                                                onClick={() => handleBookingCancel(booking._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                                            >
                                                Cancel
                                            </button>
                                        )
                                            : booking.allocation.customerApproval === 'Pending' &&
                                                booking.status === 'Allocated' ||
                                                booking.status === 'Progress' ||
                                                booking.status === 'Pending' ?
                                                <button
                                                    onClick={() => {
                                                        handleOpenApproval(booking.allocation)
                                                    }}
                                                    className='bg-blue-400 px-3 py-1 text-white rounded hover:bg-blue-500'>
                                                    New Request
                                                </button>
                                                : booking.status === 'Unpaid' ?
                                                    <button
                                                        onClick={() => {
                                                            handleOpenPaymentPopup(booking.allocation);
                                                        }}
                                                        className='bg-green-400 px-3 py-1 text-white rounded hover:bg-green-500'>
                                                        Payment
                                                    </button>
                                                    : 'No action'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {approvalPopup && <CustomerWorkApproval close={handleCloseApproval} allocation={currentAllocation} />}
            {openPaymentPopup && <PaymentPopup close={handleClosePayment} allocation={currentAllocation} />}
        </div>
    );
};

export default CurrentBookings;
