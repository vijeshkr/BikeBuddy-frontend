import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import LoadingIndicator from '../LoadingIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { setLeaves, updateLeaveStatus } from '../../redux/features/leavesSlice';
import socket from '../../common/socket';

const MechanicLeaveHistory = () => {

    // State to manage loading
    const [loading, setLoading] = useState(false);

    // Access the leaves state from the Redux store
    const leaves = useSelector((state) => state.leaves.leaves);
    const dispatch = useDispatch();

    // State to manage the selected filter
    const [statusFilter, setStatusFilter] = useState('All');

    // Function for fetch mechanic leave history from the server
    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get('/get-mechanic-leaves');
            if (response.data.success) {
                // Update the state with fetched leave data
                dispatch(setLeaves({ leaves: response.data.data.reverse() }));
            }
        } catch (error) {
            console.error('Failed to apply leave:', error);
        } finally {
            setLoading(false);
        }
    }

    // useEffect hook to fetch leave history 
    useEffect(() => {
        fetchLeaves();
    }, []);

    useEffect(() => {

        socket.on('leaveStatusUpdate', (updatedLeave) => {
            dispatch(updateLeaveStatus(updatedLeave));
        });

        // Clean up socket event listener
        return () => {
            socket.off('leaveStatusUpdate');
        }
    });

    // Handle change in the filter dropdown
    const handleFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    // Filter leaves based on the selected status
    const filteredLeaves = leaves.filter(leave =>
        statusFilter === 'All' || leave.status === statusFilter
    );

    return (
        <div>
            {loading && <LoadingIndicator />}
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

            {/* Table for the desktop view */}
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
                        {filteredLeaves.length === 0 ? <tr className='p-5'><td>No leave history available</td></tr> :
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