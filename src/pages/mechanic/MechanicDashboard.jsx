import React, { useEffect, useState } from 'react';
import DataCard from '../../components/admin/DataCard';
import { useDispatch, useSelector } from 'react-redux';
import makeRequest from '../../common/axios';
import { setAllAllocations } from '../../redux/features/allocationsSlice';
import { selectAllocationStats } from '../../redux/selectors/allocationsSelectors';
import MechanicAllocations from '../../components/mechanic/MechanicAllocations';

const MechanicDashboard = () => {
  // Access user details from the Redux store
  const user = useSelector((state) => state.user.user);
  // Select allocations status counts from the Redux store
  const { statusCounts } = useSelector(selectAllocationStats);

  const dispatch = useDispatch();

  // State for manage loading
  const [loading, setLoading] = useState(false);

  // Fetch function for allocations by mechanic ID
  const fetchAllocations = async () => {
    setLoading(true);
    try {
      // API call
      const response = await makeRequest.get(`/get-allocations/${user._id}`);
      if (response.data.success) {
        dispatch(setAllAllocations({ allocations: response.data.data }));
      }
    } catch (error) {
      console.error('Error while fetch allocations ', error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch allocations when component mounts
  useEffect(() => {
    if (user) { // Check if user is available
      fetchAllocations();
    }
  }, [user]);

  return (
    <div className='flex flex-col xl:flex-row gap-4'>
      <div className='flex flex-col gap-6 xl:w-3/4'>
        {/* Display booking status counts */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <DataCard status={'Allocated'} count={statusCounts.Allocated} />
          <DataCard status={'In Progress'} count={statusCounts.Progress} />
          <DataCard status={'Pending'} count={statusCounts.Pending} />
          <DataCard status={'Completed'} count={statusCounts.Completed} />
        </div>

        {/* Display all bookings table */}
        <div className='lg:min-w-[700px]'>
          <MechanicAllocations />
        </div>
      </div>

      {/* Right sidebar with charts and new booking options */}
      <div className='bg-green-200 xl:w-1/4 flex flex-wrap flex-col-reverse xl:flex-col gap-4'>
        {/* Display booking count chart service and breakdown count */}
        <div className='min-w-[320px] xl:min-w-[220px] w-full'>
          {/* <CountChart /> */}
        </div>
        {/* New booking buttons for service and breakdown */}
        {/* <div className='bg-white rounded-xl w-full p-4 shadow-custom'>
          <h1 className='text-xl font-medium'>New booking</h1>
          <div className='flex justify-evenly mt-4 min-w-[290px] xl:min-w-[220px]'>
            <button
              // onClick={handleOpenServiceBooking}
              className='px-2 py-1 my-2 rounded-md bg-blue-200'>Service</button>
            <button
              // onClick={handleOpenBreakdownBooking}
              className='px-2 py-1 my-2 rounded-md bg-yellow-200'>Breakdown</button>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default MechanicDashboard;