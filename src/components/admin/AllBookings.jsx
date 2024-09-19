import React, { useEffect, useState } from 'react';
import AllocationPopup from './AllocationPopup';
import BookingDetailsPopup from './BookingDetailsPopup';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Pagination from '../common/Pagination';
import SearchBox from '../common/SearchBox';

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
    // Access booking details from the Redux store
    const bookings = useSelector((state) => state.allBookings.allBookings);
    // State to open/close handle allocation popup
    const [openAllocate, setOpenAllocate] = useState(false)
    // State to open/close handle booking details popup
    const [openBookingDetails, setOpenBookingDetails] = useState(false)
    // State to manage selected booking
    const [selectedBooking, setSelectedBooking] = useState(null);
    // State to manage search
    const [searchTerm, setSearchTerm] = useState('');
    // State to manage the selected filter
    const [statusFilter, setStatusFilter] = useState('All');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(10);

    // Search logic
    const searchData = bookings.filter(booking => booking?.vehicleId?.registrationNumber.toLowerCase().includes(searchTerm.toLocaleLowerCase()))
        .filter(booking => booking.status !== 'Cancelled' && booking.status !== 'Paid')
        .filter(booking => statusFilter === 'All' || booking.status === statusFilter);

    // Pagination logic
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentPageBookings = searchData.slice(indexOfFirstBooking, indexOfLastBooking);

    const totalPages = Math.ceil(searchData.length / bookingsPerPage);

    const navigate = useNavigate();

    // Function to fetch all bookings from the backend
    // const fetchBookings = async () => {
    //     try {
    //         const response = await makeRequest.get('/get-all-booking');
    //         if (response.data.success) {
    //             setBookings(response.data.data);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching all bookings: ', error);
    //     }
    // };

    // Handle search term
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    // Handle open allocate popup
    const openHandleAllocate = () => {
        setOpenAllocate((prev) => !prev);
    };

    // Handle close allocate popup
    const closeHandleAllocate = () => {
        setOpenAllocate((prev) => !prev);
    };

    // Handle open booking details popup
    const openHandleBookingDetails = () => {
        setOpenBookingDetails((prev) => !prev);
    };

    // Handle close booking details popup
    const closeHandleBookingDetails = () => {
        setOpenBookingDetails((prev) => !prev);
    };

    // Handle selected booking
    const handleSelectedBooking = (bookingId) => {
        const booking = bookings.find(booking => booking._id === bookingId);
        setSelectedBooking(booking);
    };

    // Handle filter change
    const handleFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };


    return (
        <div className="p-4 lg:shadow-custom rounded-lg bg-white">
            <h3 className="text-xl sm:text-2xl text-center sm:text-left font-semibold mb-4">All Bookings</h3>
            <div className='flex flex-col xs:flex-row justify-between items-center'>
                {/* Search box */}
                <div>
                    <SearchBox value={searchTerm} onChange={handleSearch} />
                </div>
                {/* Filter Options */}
                <div className='pb-2'>
                    <select
                        value={statusFilter}
                        onChange={handleFilterChange}
                        className='bg-bb-theme-500 cursor-pointer outline-none text-sm text-white p-1 rounded-md'
                    >
                        <option value='All'>Filter</option>
                        <option value='Unallocated'>Unallocated</option>
                        <option value='Allocated'>Allocated</option>
                        <option value='Progress'>In Progress</option>
                        <option value='Pending'>Pending</option>
                        <option value='Completed'>Completed</option>
                        <option value='Unpaid'>Unpaid</option>
                    </select>
                </div>
            </div>
            {currentPageBookings.length === 0 ? (
                <p className="text-gray-500">No bookings available.</p>
            ) : (
                <div>

                    {/* Table format for larger screens */}
                    <table className="hidden lg:table w-full divide-y divide-gray-200">
                        <thead className='bg-bb-theme-50'>
                            <tr className="text-left">
                                {/* <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th> */}
                                <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Service Type</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Booking Date</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Mechanic</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {currentPageBookings.map((booking) => (
                                // booking?.status !== 'Paid' &&
                                <tr key={booking._id} className="hover:bg-bb-theme-50 even:bg-gray-50">
                                    {/* <td className="px-4 py-3">{booking.customerId.name}</td> */}
                                    <td
                                        onClick={() => {
                                            handleSelectedBooking(booking._id);
                                            openHandleBookingDetails();

                                        }}
                                        className="px-4 py-3 cursor-pointer">{booking.vehicleId.registrationNumber}</td>
                                    <td className={`px-4 py-3 ${booking.breakdown && 'text-red-600'}`}>{booking.breakdown ? 'Breakdown' : booking.serviceType?.packageName}</td>
                                    <td className="px-4 py-3">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                    <td className={`px-4 py-3 
                                        ${booking.status === 'Unallocated' && 'text-gray-400'}
                                        ${booking.status === 'Allocated' && 'text-blue-400'}
                                        ${booking.status === 'Pending' && 'text-yellow-400'}
                                        ${booking.status === 'Progress' && 'text-green-300'}
                                        ${booking.status === 'Cancelled' && 'text-red-600'}
                                        ${booking.status === 'Unpaid' && 'text-red-600'}
                                        ${booking.status === 'Completed' && 'text-green-600'}`}>
                                        {booking.status}
                                    </td>
                                    <td
                                        className={`px-4 py-3 ${!booking.allocation ? `${booking.status !== 'Cancelled' ? 'cursor-pointer text-gray-400' : 'text-red-600'}` : ''}`}>
                                        {booking.allocation ? booking.allocation.mechanicId.name : booking.status}
                                    </td>
                                    <td
                                        className={`px-4 py-3 ${!booking.allocation ? `${booking.status !== 'Cancelled' ? 'cursor-pointer text-black' : 'text-red-600'}` : 'text-blue-400'}`}>

                                        {booking.status === 'Unallocated' ? (
                                            <button
                                                onClick={() => {
                                                    if (!booking.allocation) {
                                                        handleSelectedBooking(booking._id);
                                                        openHandleAllocate();
                                                    }
                                                }}
                                                className="bg-bb-theme-500 text-white px-3 py-1 rounded-md hover:bg-bb-theme-600 active:bg-bb-theme-700 transition duration-300"
                                            >
                                                Allocate
                                            </button>
                                        ) : (
                                            booking.status === 'Completed' ? (
                                                <button
                                                    onClick={() => {
                                                        navigate(`billing/${booking.allocation?._id}`, { replace: true });
                                                    }}
                                                    className="bg-green-600 text-white px-5 py-1 rounded-md hover:bg-green-700 transition duration-300"
                                                >
                                                    Billing
                                                </button>
                                            ) :
                                                (
                                                    <span className="text-gray-400">No action</span>
                                                )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Card format for mobile devices */}
                    <div className="lg:hidden">
                        {searchData.map((booking) => (
                            booking?.status !== 'Paid' &&
                            <div key={booking._id} className="bg-white text-sm sm:text-base rounded-lg p-4 mb-4 border border-gray-200">
                                <div className="mb-2">
                                    <span className='font-medium'>Customer:</span> {booking.customerId.name}
                                </div>
                                <div className="mb-2">
                                    <span className='font-medium'>Vehicle:</span> {booking.vehicleId.registrationNumber}
                                </div>
                                {
                                    booking.place && <div className="mb-2">
                                        <span className='font-medium'>Place:</span> {booking.place}
                                    </div>
                                }
                                {
                                    booking.phone && <div className="mb-2">
                                        <span className='font-medium'>Phone:</span> {booking.phone}
                                    </div>
                                }
                                {
                                    booking.description &&
                                    <div className="mb-2">
                                        <div className='font-medium underline'>Job description:</div>
                                        <div className='w-[300px] text-gray-500'>
                                            {booking.description}
                                        </div>
                                    </div>
                                }
                                <div className={`mb-2 ${booking.breakdown && 'text-red-600'}`}>
                                    <span className='font-medium text-black'>Service Type:</span> {booking.breakdown ? 'Breakdown' : booking.serviceType?.packageName}
                                </div>
                                <div className="mb-2">
                                    <span className='font-medium'>Booking Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}
                                </div>
                                <div className={`mb-2
                                    ${booking.status === 'Unallocated' && 'text-gray-400'}
                                    ${booking.status === 'Allocated' && 'text-blue-400'}
                                    ${booking.status === 'Pending' && 'text-yellow-400'}
                                    ${booking.status === 'Progress' && 'text-green-300'}
                                    ${booking.status === 'Cancelled' && 'text-red-600'}
                                    ${booking.status === 'Unpaid' && 'text-red-600'}
                                    ${booking.status === 'Completed' && 'text-green-600'}`}>
                                    <span className='font-medium text-black'>Status:</span> {booking.status}
                                </div>
                                <div className={`mb-2 flex justify-between items-start`}>
                                    <div>
                                        <span className='font-medium text-black'>Mechanic:</span>
                                        <span
                                            onClick={() => {
                                                if (!booking.allocation && booking.status !== 'Cancelled') {
                                                    handleSelectedBooking(booking._id);
                                                    openHandleAllocate();
                                                }
                                            }}
                                            className={`px-1.5
                                    ${!booking.allocation ? `${booking.status !== 'Cancelled' ? 'cursor-pointer text-black' : 'text-red-600'}` : 'text-black'}
                                    ${booking.status === 'Unallocated' && 'text-gray-400'}`}
                                        >
                                            {booking.allocation ? booking.allocation.mechanicId.name : `${booking.status !== 'Cancelled' ? 'Allocate' : 'Cancelled'}`}
                                        </span>
                                    </div>

                                    <div
                                        className={`px-4 py-3 ${!booking.allocation ? `${booking.status !== 'Cancelled' ? 'cursor-pointer text-black' : 'text-red-600'}` : 'text-blue-400'}`}>

                                        {booking.status === 'Unallocated' ? (
                                            <button
                                                onClick={() => {
                                                    if (!booking.allocation) {
                                                        handleSelectedBooking(booking._id);
                                                        openHandleAllocate();
                                                    }
                                                }}
                                                className="bg-bb-theme-500 text-white px-3 py-1 rounded-md hover:bg-bb-theme-600 transition duration-300"
                                            >
                                                Allocate
                                            </button>
                                        ) : (
                                            booking.status === 'Completed' ? (
                                                <button
                                                    onClick={() => {
                                                        navigate(`billing/${booking.allocation?._id}`, { replace: true });
                                                    }}
                                                    className="bg-green-600 text-white px-5 py-1 rounded-md hover:bg-green-700 transition duration-300"
                                                >
                                                    Billing
                                                </button>
                                            ) :
                                                (
                                                    <span className="text-gray-500">No action</span>
                                                )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination component */}
            {currentPageBookings.length > 0 && <div className='p-4 hidden lg:block'>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>}

            {openAllocate && <AllocationPopup close={closeHandleAllocate} booking={selectedBooking} />}
            {openBookingDetails && <BookingDetailsPopup close={closeHandleBookingDetails} booking={selectedBooking} />}
        </div>
    );
};

export default AllBookings;
