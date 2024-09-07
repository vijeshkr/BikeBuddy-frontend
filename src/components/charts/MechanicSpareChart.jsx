/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import makeRequest from '../../common/axios';



const MechanicSpareChart = () => {

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
  
  const CustomizedLabel = (props) => {
    const { x, y, stroke, value } = props;
    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
  };
  
  const CustomizedAxisTick = (props) => {
    const { x, y, stroke, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
          {payload.value}
        </text>
      </g>
    );
  };

  
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

  // Transform the mechanic targets into chart-compatible data format
  let data = targets?.map(mechanic => ({
    name: mechanic?.mechanicId?.name,
    Target: mechanic?.achievement[0]?.spareTarget,
    Achieved: mechanic?.achievement[0]?.spareAchievement
  }));

  // Fetch mechanic targets when th component is first mounted
  useEffect(() => {
    fetchTargets();
  }, []);
  return (
    <div className='h-full bg-white rounded-lg p-4'>
      {/* Title for the chart */}
      <h1 className='font-semibold text-lg'>Spare Achievements</h1>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,   
        }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke='#ddd' />
          <XAxis dataKey="name"
            axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
            tickMargin={10} />
          <YAxis axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
            tickMargin={20} />
          <Tooltip contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
          <Legend align='center' verticalAlign='top' wrapperStyle={{ paddingTop: '10px', paddingBottom: '30px' }} />
          <Line
            type="monotone"
            dataKey="Target"
            stroke="#8884d8"
            label={<CustomizedLabel stroke="#8884d8" />}
            strokeWidth={5} />
          <Line
            type="monotone"
            dataKey="Achieved"
            stroke="#82ca9d"
            label={<CustomizedLabel stroke="#82ca9d" />}
            strokeWidth={5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MechanicSpareChart;
