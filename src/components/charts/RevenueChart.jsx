import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import makeRequest from '../../common/axios';
import { displayINRCurrency } from '../../common/utils'

const RevenueChart = () => {

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

  // Calculate the total spare achievement by summing up the `spareAchievement` of all mechanics
  const totalSpareAchievement = targets?.map(mechanic =>
    mechanic?.achievement[0]?.spareAchievement || 0
  ).reduce((total, current) => total + current, 0);

  // Calculate the total labor achievement by summing up the `labourAchievement` of all mechanics
  const totalLabourAchievement = targets?.map(mechanic =>
    mechanic?.achievement[0]?.labourAchievement || 0
  ).reduce((total, current) => total + current, 0);

  // Calculate total revenue by adding labor and spare achievements
  const totalRevenue = totalLabourAchievement + totalSpareAchievement;

  // Fetch the mechanic targets when the component is mounted
  useEffect(() => {
    fetchTargets();
  }, []);

  // Data to be used in the Pie chart (labour and spare achievements)
  const data = [
    { value: totalLabourAchievement },
    { value: totalSpareAchievement },
  ];

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className='h-full bg-white rounded-lg p-4'>
      {/* Title for the chart */}
      <h1 className='font-semibold text-lg'>Total Revenue</h1>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend and total revenue display */}
      <div className='flex justify-between'>
        {/* Legend of the chart */}
        <div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-full bg-[#0088FE]'></div>
            <span className='text-[#0088FE]'>Labour</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-full bg-[#00C49F]'></div>
            <span className='text-[#00C49F]'>Spare</span>
          </div>
        </div>
        {/* Total revenue display */}
        <div>
          <h3 className='text-slate-400'>Total Revenue</h3>
          <p className='text-sm text-slate-400 text-right'>{displayINRCurrency(totalRevenue)}</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
