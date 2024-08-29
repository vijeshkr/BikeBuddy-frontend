import React, { useEffect } from 'react'
import DataCard from '../../components/admin/DataCard';
import AllBookings from '../../components/admin/AllBookings';
import { useDispatch, useSelector } from 'react-redux';
import { selectAdminBookingStats } from '../../redux/selectors/allBookingSelectors';
import makeRequest from '../../common/axios';
import { setAllBookings } from '../../redux/features/allBookingAdminSlice';
import CountChart from '../../components/charts/CountChart';

const AdminBookingPage = () => {

  const { statusCounts } = useSelector(selectAdminBookingStats);
  const dispatch = useDispatch();

  // Function to fetch all bookings from the backend
  const fetchBookings = async () => {
    try {
        const response = await makeRequest.get('/get-all-booking');
        if (response.data.success) {
          dispatch(setAllBookings({allBookings: response.data.data}));
        }
    } catch (error) {
        console.error('Error fetching all bookings: ', error);
    }
};

    // Fetch bookings when the component mounts
    useEffect(() => {
      fetchBookings();
  }, []);

  return (
    <div className='flex gap-4'>
      <div className='flex flex-col gap-6 w-3/4'>
        <div className='flex gap-4 justify-between flex-wrap'>
          <DataCard status={'Unallocated'} count={statusCounts.Unallocated} />
          <DataCard status={'Allocated'} count={statusCounts.Allocated} />
          <DataCard status={'Pending'} count={statusCounts.Pending} />
          <DataCard status={'Completed'} count={statusCounts.Completed} />
        </div>
        <div>
          <AllBookings />
        </div>
      </div>
      <div className='w-1/4'>
        <div>
          <CountChart/>
        </div>
      </div>
    </div>
  )
}

export default AdminBookingPage;