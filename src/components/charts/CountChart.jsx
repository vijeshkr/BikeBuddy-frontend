import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { selectAdminBookingStats } from '../../redux/selectors/allBookingSelectors';
import { useSelector } from 'react-redux';

const CountChart = () => {

    const { totalBookings, breakdownCounts } = useSelector(selectAdminBookingStats);

    const data = [
        {
            name: 'Total',
            count: totalBookings,
            fill: 'white',
        },
        {
            name: 'Breakdown',
            count: breakdownCounts.true,
            fill: '#FAE27C',
        },
        {
            name: 'Service',
            count: breakdownCounts.false,
            fill: '#C3EBFA',
        },

    ];

    return (
        <div className='bg-white rounded-xl w-full h-full p-4 shadow-custom'>
            {/* Title */}
            <h1 className='text-lg font-medium text-left'>Total bookings</h1>
            {/* Chart */}
            <div className='h-60 w-full'>
                <ResponsiveContainer>
                    <RadialBarChart
                        key={totalBookings + breakdownCounts.false + breakdownCounts.true}
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="100%"
                        barSize={32}
                        data={data}>
                        <RadialBar
                            background
                            dataKey="count"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom */}
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-[#C3EBFA] rounded-full" />
                    <h1 className="font-bold">{breakdownCounts.false}</h1>
                    <h2 className="text-sm text-gray-300">Service</h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-[#FAE27C] rounded-full" />
                    <h1 className="font-bold">{breakdownCounts.true}</h1>
                    <h2 className="text-sm text-gray-300">Breakdown</h2>
                </div>
            </div>

        </div>
    )
}

export default CountChart;