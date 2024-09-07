import React, { useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { selectAdminBookingStats } from '../../redux/selectors/allBookingSelectors';
import { useDispatch, useSelector } from 'react-redux';
import makeRequest from '../../common/axios';
import { setAllBookings } from '../../redux/features/allBookingAdminSlice';

const StatusCountChart = () => {
  // Select booking status counts from the Redux store
  const { statusCounts } = useSelector(selectAdminBookingStats);
  const dispatch = useDispatch();

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

   // Define data for the pie chart based on the booking status counts from Redux
  const data = [
    { value: statusCounts.Unallocated },
    { value: statusCounts.Allocated },
    { value: statusCounts.Progress },
    { value: statusCounts.Pending },
    { value: statusCounts.Completed },
    { value: statusCounts.Unpaid },
  ];

  // Define colors for each slice of the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9003fc', '#f803fc'];

  // Fetch bookings when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []);
  return (
    <div className='h-full bg-white rounded-lg p-4 flex flex-col items-center'>
      {/* Chart title */}
      <h1 className='font-semibold text-lg text-left w-full'>Work Status</h1>
      <PieChart width={250} height={250}>
        <Pie
          label
          data={data}
          cx='50%'
          cy='50%'
          innerRadius={70}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      {/* Legent of the pie chart */}
      <div className='flex justify-between w-full'>
        {/* Left section */}
        <div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-full bg-[#0088FE]'></div>
            <span className='text-[#0088FE]'>Unallocated</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-full bg-[#00C49F]'></div>
            <span className='text-[#00C49F]'>Allocated</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-full bg-[#0088FE]'></div>
            <span className='text-[#FFBB28]'>In Progress</span>
          </div>
        </div>
        {/* Right section */}
        <div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-full bg-[#00C49F]'></div>
            <span className='text-[#FF8042]'>Pending</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-full bg-[#0088FE]'></div>
            <span className='text-[#9003fc]'>Completed</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-full bg-[#00C49F]'></div>
            <span className='text-[#f803fc]'>Unpaid</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCountChart;
