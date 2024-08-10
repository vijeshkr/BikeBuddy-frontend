import React, { useEffect, useState } from 'react'
import makeRequest from '../../common/axios';

const MechanicLeaveHistory = () => {
    // State to manage loading
    const [loading, setLoading] = useState(false);
    // State to manage all leaves
    const [leaves, setLeaves] = useState([]);
    // State to manage the selected filter
    const [statusFilter, setStatusFilter] = useState('All');

    // Fetch function for mechanic leave history
    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get('/get-mechanic-leaves');
            if (response.data.success) {
                setLeaves(response.data.data);
            }
        } catch (error) {
            console.error('Failed to apply leave:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeaves();
    }, []);

    // Handle filter change
    const handleFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    // Filter leaves based on the selected status
    const filteredLeaves = leaves.filter(leave =>
        statusFilter === 'All' || leave.status === statusFilter
    );

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold text-xl xs:text-2xl pb-4'>Leave History</h1>
                {/* Filter Options */}
                <div className='pb-1'>
                    <label htmlFor='statusFilter' className='mr-2 text-xs xs:text-sm text-slate-400'>Filter by status:</label>
                    <select
                        id='statusFilter'
                        value={statusFilter}
                        onChange={handleFilterChange}
                        className='bg-primaryColor cursor-pointer outline-none text-xs xs:text-sm text-white p-1 rounded'
                    >
                        <option value='All'>All</option>
                        <option value='Pending'>Pending</option>
                        <option value='Approved'>Approved</option>
                        <option value='Rejected'>Rejected</option>
                    </select>
                </div>
            </div>

            <div className='hidden xs:flex overflow-y-auto scrollbar-none  max-h-[500px]'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-primaryColor text-white text-sm text-left'>
                            <th className='font-normal px-2'>No</th>
                            <th className='font-normal px-2'>Start Date</th>
                            <th className='font-normal px-2'>End Date</th>
                            <th className='font-normal px-2'>Days</th>
                            <th className='font-normal px-2'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeaves.length === 0 ? <div className='p-5'>No leave history available</div> :
                            filteredLeaves.map((leave, index) => (
                                <tr key={leave._id} className='border text-sm text-start'>
                                    <td className='p-1.5 text-slate-600'>{index + 1}</td>
                                    <td className='p-1.5 text-slate-600'>{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td className='p-1.5 text-slate-600'>{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td className='p-1.5 text-slate-600'>{`${leave.days === 0.5 ? `Half day` : `${leave.days} Days`}`}</td>
                                    <td className={`p-1.5 ${leave.status === 'Pending' ? 'text-slate-400' :
                                        `${leave.status === 'Rejected' ? 'text-red-500' : 'text-green-500'}`}`} >{leave.status}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Leve history for small screens */}

            <div className='xs:hidden'>
            {filteredLeaves.length === 0 ? <div className='p-5'>No leave history available</div> :
                            filteredLeaves.map((leave, index) => (
                                <div key={leave._id} className='flex justify-between shadow-custom my-4 px-3 py-2 rounded-md'>
                                    <div>
                                    <p className='font-medium text-lg'>{`${new Date(leave.startDate).toLocaleDateString() + `-` + new Date(leave.endDate).toLocaleDateString()}`}</p>
                                    <p>{`${leave.days === 0.5 ? `Half day` : `${leave.days} Days`}`}</p>
                                    </div>
                                    <div>
                                        <p className={`p-1.5 ${leave.status === 'Pending' ? 'text-slate-400' :
                                        `${leave.status === 'Rejected' ? 'text-red-500' : 'text-green-500'}`}`}>
                                            {leave.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
            </div>
        </div>
    )
}

export default MechanicLeaveHistory;