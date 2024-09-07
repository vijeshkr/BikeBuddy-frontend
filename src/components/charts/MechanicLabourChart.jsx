import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import makeRequest from '../../common/axios';

const MechanicLabourChart = () => {

  const dummyData = [
    {
      name: 'Jon Snow',
      Target: 4000,
      Achieved: 2400,
    },
    {
      name: 'Jon Snow',
      Target: 3000,
      Achieved: 1398,
    },
    {
      name: 'Jon Snow',
      Target: 2000,
      Achieved: 9800,
    },
    {
      name: 'Jon Snow',
      Target: 2780,
      Achieved: 3908,
    },
    {
      name: 'Jon Snow',
      Target: 1890,
      Achieved: 4800,
    },
    {
      name: 'Jon Snow',
      Target: 2390,
      Achieved: 3800,
    },
    {
      name: 'Jon Snow',
      Target: 3490,
      Achieved: 4300,
    },
  ];

  // State to manage loading
  const [loading, setLoading] = useState(false);
  // State to manage targets
  const [targets, setTargets] = useState(null);

  // Function for fetch mechanic targets based on filter
  const fetchTargets = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get('/get-all-mechanic-targets', {
        // params: { month: selectedMonth, year: selectedYear }
      });
      setTargets(response.data.data);
    } catch (error) {
      console.error('Error fetching mechanic targets:', error);
    } finally {
      setLoading(false);
    }
  }

  // Transform mechanic targets into chart-compatible format
  let data = targets?.map(mechanic => ({
    name: mechanic?.mechanicId?.name,
    Target: mechanic?.achievement[0]?.labourTarget,
    Achieved: mechanic?.achievement[0]?.labourAchievement
  }));

  // useEffect hook to trigger the data fetching when the component mounts
  useEffect(() => {
    fetchTargets();
  }, []);

  return (
    <div className='h-full bg-white rounded-lg p-4'>
      {/* Title for the chart */}
      <h1 className='font-semibold text-lg'>Labour Achievements</h1>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd' />
          <XAxis dataKey="name" axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
          <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
          <Legend align='left' verticalAlign='top' wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }} />
          <Bar dataKey="Target" fill="#fae27c"
            legendType='circle'
            radius={[10, 10, 0, 0]} />
          <Bar dataKey="Achieved" fill="#c3ebfa"
            legendType='circle'
            radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MechanicLabourChart;
