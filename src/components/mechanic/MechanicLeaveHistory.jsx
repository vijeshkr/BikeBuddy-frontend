import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import LoadingIndicator from '../LoadingIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { setLeaves, updateLeaveStatus } from '../../redux/features/leavesSlice';
import socket from '../../common/socket';
import Pagination from '../common/Pagination';

const MechanicLeaveHistory = () => {

    // State to manage loading
    const [loading, setLoading] = useState(false);

    // Access the leaves state from the Redux store
    const leaves = useSelector((state) => state.leaves.leaves);
    const dispatch = useDispatch();

    // State to manage the selected filter
    const [statusFilter, setStatusFilter] = useState('All');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [leavesPerPage] = useState(10);

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

    // Pagination logic
    const indexOfLastLeave = currentPage * leavesPerPage;
    const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
    const currentPageLeaves = filteredLeaves.slice(indexOfFirstLeave, indexOfLastLeave);

    const totalPages = Math.ceil(filteredLeaves.length / leavesPerPage);

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
                        className='bg-bb-theme-500 cursor-pointer outline-none text-xs xs:text-sm text-white p-1 rounded-md'
                    >
                        <option value='All'>All</option>
                        <option value='Pending'>Pending</option>
                        <option value='Approved'>Approved</option>
                        <option value='Rejected'>Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table for the desktop view */}
            <div className='hidden sm:block'>
                <table className='w-full divide-gray-200'>
                    <thead className='bg-bb-theme-50'>
                        <tr className='text-left'>
                            <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>No</th>
                            <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>Start Date</th>
                            <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>End Date</th>
                            <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>Days</th>
                            <th className='px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider'>Status</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200' >
                        {filteredLeaves.length === 0 ? <tr className='p-5'><td>No leave history available</td></tr> :
                            currentPageLeaves.map((leave, index) => (
                                <tr key={leave._id} className='hover:bg-bb-theme-50 even:bg-gray-50'>
                                    <td className='px-4 py-3 text-slate-600'>{index + 1}</td>
                                    <td className='px-4 py-3 text-slate-600'>{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td className='px-4 py-3 text-slate-600'>{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td className='px-4 py-3 text-slate-600'>{`${leave.days === 0.5 ? `Half day` : `${leave.days} Days`}`}</td>
                                    <td className={`px-4 py-3 ${leave.status === 'Pending' ? 'text-slate-400' :
                                        `${leave.status === 'Rejected' ? 'text-red-500' : 'text-green-500'}`}`} >{leave.status}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {/* Pagination component */}
                {currentPageLeaves.length > 0 && <div className='p-4 hidden sm:block'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>}
            </div>

            {/* Leve history for small screens */}

            <div className='sm:hidden'>
                {filteredLeaves.length === 0 ? <div className='p-5'>No leave history available</div> :
                    currentPageLeaves.map((leave, index) => (
                        <div key={leave._id} className='flex justify-between border my-4 px-3 py-2 rounded-md'>
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