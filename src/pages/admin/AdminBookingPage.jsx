import React, { useEffect, useState } from 'react'
import DataCard from '../../components/admin/DataCard';
import AllBookings from '../../components/admin/AllBookings';
import { useDispatch, useSelector } from 'react-redux';
import { selectAdminBookingStats } from '../../redux/selectors/allBookingSelectors';
import makeRequest from '../../common/axios';
import { setAllBookings } from '../../redux/features/allBookingAdminSlice';
import CountChart from '../../components/charts/CountChart';
import AdminServiceBookingPopup from '../../components/admin/AdminServiceBookingPopup';
import { setCustomerDetails } from '../../redux/features/customersSlice';
import AdminBreakdownBookingPopup from '../../components/admin/AdminBreakdownBookingPopup';

const AdminBookingPage = () => {

  // State to manage loading
  const [loading, setLoading] = useState(false);

  // State to manage visibility of popups
  const [openServiceBooking, setOpenServiceBooking] = useState(false);
  const [openBreakdownBooking, setOpenBreakdownBooking] = useState(false);

  // Select booking status counts from the Redux store
  const { statusCounts } = useSelector(selectAdminBookingStats);
  const dispatch = useDispatch();

  // Role for fetching customer data
  const role = 'customer';

  // Function for fetch customer data
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get(`/get-users/${role}`);
      if (response.data.success) {
        // Update the Redux store with fetched data
        dispatch(setCustomerDetails({ customer: response.data.data }));
      }
    } catch (error) {
      console.error('Error while fetching customer details: ', error);
    } finally {
      setLoading(false);
    }
  }

  // Function to fetch all bookings from the backend
  const fetchBookings = async () => {
    try {
      const response = await makeRequest.get('/get-all-booking');
      if (response.data.success) {
        dispatch(setAllBookings({ allBookings: response.data.data }));
      }
    } catch (error) {
      console.error('Error fetching all bookings: ', error);
    }
  };

  // Toggle visibility of the service booking popup
  const handleOpenServiceBooking = () => {
    setOpenServiceBooking(!openServiceBooking);
  }
  // Toggle visibility of the breakdown popup
  const handleOpenBreakdownBooking = () => {
    setOpenBreakdownBooking(!openBreakdownBooking);
  }

  // Close the service booking popup
  const handleCloseServiceBooking = () => {
    setOpenServiceBooking(prev => !prev);
  }
  // Close the breakdown booking popup
  const handleCloseBreakdownBooking = () => {
    setOpenBreakdownBooking(prev => !prev);
  }

  // Fetch bookings and customers when the component mounts
  useEffect(() => {
    fetchBookings();
    fetchCustomers();
  }, []);

  return (
    <div className='flex flex-col xl:flex-row gap-4'>
      <div className='flex flex-col gap-6 xl:w-3/4'>
      {/* Display booking status counts */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <DataCard status={'Unallocated'} count={statusCounts.Unallocated} />
          <DataCard status={'Allocated'} count={statusCounts.Allocated} />
          <DataCard status={'In Progress'} count={statusCounts.Progress} />
          <DataCard status={'Pending'} count={statusCounts.Pending} />
          <DataCard status={'Cancelled'} count={statusCounts.Cancelled} />
          <DataCard status={'Completed'} count={statusCounts.Completed} />
        </div>
        {/* Display all bookings table */}
        <div className='lg:min-w-[700px]'>
          <AllBookings />
        </div>
      </div>
      {/* Right sidebar with charts and new booking options */}
      <div className='xl:w-1/4 flex flex-wrap flex-col-reverse xl:flex-col gap-4'>
      {/* Display booking count chart service and breakdown count */}
        <div className='min-w-[320px] xl:min-w-[220px] w-full'>
          <CountChart />
        </div>
        {/* New booking buttons for service and breakdown */}
        <div className='bg-white rounded-xl w-full p-4 shadow-custom'>
          <h1 className='text-xl font-medium'>New booking</h1>
          <div className='flex justify-evenly mt-4 min-w-[290px] xl:min-w-[220px]'>
            <button
              onClick={handleOpenServiceBooking}
              className='px-2 py-1 my-2 rounded-md bg-blue-200'>Service</button>
            <button
              onClick={handleOpenBreakdownBooking}
              className='px-2 py-1 my-2 rounded-md bg-yellow-200'>Breakdown</button>
          </div>
        </div>
      </div>
      
      {/* Conditionally render the service and breakdown booking popup */}
      {openServiceBooking && <AdminServiceBookingPopup close={handleCloseServiceBooking} />}
      {openBreakdownBooking && <AdminBreakdownBookingPopup close={handleCloseBreakdownBooking} />}
    </div>
  )
}

export default AdminBookingPage;