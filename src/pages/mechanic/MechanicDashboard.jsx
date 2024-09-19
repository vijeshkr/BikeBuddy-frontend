import React, { useEffect, useState } from 'react';
import DataCard from '../../components/admin/DataCard';
import { useDispatch, useSelector } from 'react-redux';
import makeRequest from '../../common/axios';
import { setAllAllocations } from '../../redux/features/allocationsSlice';
import { selectAllocationStats } from '../../redux/selectors/allocationsSelectors';
import MechanicAllocations from '../../components/mechanic/MechanicAllocations';
import { Nested } from '@alptugidin/react-circular-progress-bar'
import {displayINRCurrency} from '../../common/utils';

const MechanicDashboard = () => {
  // Access user details from the Redux store
  const user = useSelector((state) => state.user.user);
  // Select allocations status counts from the Redux store
  const { statusCounts } = useSelector(selectAllocationStats);

  const dispatch = useDispatch();

  // State for manage loading
  const [loading, setLoading] = useState(false);
  // State to manage targets
  const [targets, setTargets] = useState(null);

  // State for percentages
  const [labourAchievementPercentage, setLabourAchievementPercentage] = useState(0);
  const [spareAchievementPercentage, setSpareAchievementPercentage] = useState(0);

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

  // Fetch function for mechanic target by mechanic ID
  const fetchMechanicTarget = async () => {
    setLoading(true);
    try {
      // API call
      const response = await makeRequest.get(`/get-mechanic-target/${user._id}`);
      if (response.data.success) {
        console.log(response.data.data)
        setTargets(response.data.data);
        const data = response.data.data;

        // Calculate percentages
        const labourPercentage = Math.floor((data.achievement[0].labourAchievement / data.achievement[0].labourTarget) * 100);
        const sparePercentage = Math.floor((data.achievement[0].spareAchievement / data.achievement[0].spareTarget) * 100);

        // Update the state
        setLabourAchievementPercentage(labourPercentage);
        setSpareAchievementPercentage(sparePercentage);
      }
    } catch (error) {
      console.error('Error while fetch mechanic target ', error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch allocations when component mounts
  useEffect(() => {
    if (user) { // Check if user is available
      fetchAllocations();
      fetchMechanicTarget();
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
      <div className='xl:w-1/4 flex flex-wrap flex-col-reverse xl:flex-col gap-4'>
        {/* Display targets and achievements chart */}
        <div className='w-[320px] min-w-[320px] xl:min-w-[220px] p-4 shadow-custom rounded-md'>
          <h3 className='font-semibold text-xl sm:text-2xl p-4'>Achievements</h3>
          <Nested
            circles={[
              { text: 'Labour', value: labourAchievementPercentage, color: '#0ea5e9' },
              { text: 'Spare', value: spareAchievementPercentage, color: '#7c3aed' },
            ]}
            sx={{
              bgColor: '#cbd5e1'
            }}
          />
          <div className='flex justify-between'>
            {/* Targets */}
            <div className='flex flex-col gap-2'>
              <h3 className='font-semibold'>Targets</h3>
              <div className='flex items-center gap-2 text-sm'>
                <div className='bg-[#0ea5e9] h-4 w-4 rounded-full'></div>
                <span className='text-gray-400'>{displayINRCurrency(targets?.achievement[0]?.labourTarget)}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <div className='bg-[#7c3aed] h-4 w-4 rounded-full'></div>
                <span className='text-gray-400'>{displayINRCurrency(targets?.achievement[0]?.spareTarget)}</span>
              </div>
            </div>
            {/* Achievements */}
            <div className='flex flex-col gap-2'>
              <h3 className='font-semibold'>Achievements</h3>
              <div className='flex items-center gap-2 text-sm'>
                <div className='bg-[#0ea5e9] h-4 w-4 rounded-full'></div>
                <span className='text-gray-400'>{displayINRCurrency(targets?.achievement[0]?.labourAchievement)}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <div className='bg-[#7c3aed] h-4 w-4 rounded-full'></div>
                <span className='text-gray-400'>{displayINRCurrency(targets?.achievement[0]?.spareAchievement)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MechanicDashboard;