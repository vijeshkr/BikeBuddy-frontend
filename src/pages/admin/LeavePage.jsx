import React, { useState, useEffect } from 'react';
import makeRequest from '../../common/axios';
import socket from '../../common/socket';
import Pagination from '../../components/common/Pagination';
import SearchBox from '../../components/common/SearchBox';

const LeavePage = () => {
    // State to manage all leaves
    const [leaves, setLeaves] = useState([]);
    // State to manage loading
    const [loading, setLoading] = useState(false);
    // State to manage the selected filter
    const [statusFilter, setStatusFilter] = useState('All');
    // State to manage search
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [leavesPerPage] = useState(10);

    // Handle search term
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    // Fetch function for leave data from the server
    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get('/get-all-leaves');
            if (response.data.success) {
                setLeaves(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error while fetching leave records:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    // Handle filter change
    const handleFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    // Search and filter logic
    const filteredData = leaves.filter(leave => leave?.mechanicId?.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()))
        .filter(leave => statusFilter === 'All' || leave.status === statusFilter);

    // Pagination logic
    const indexOfLastLeave = currentPage * leavesPerPage;
    const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
    const currentPageLeaves = filteredData.slice(indexOfFirstLeave, indexOfLastLeave);

    const totalPages = Math.ceil(filteredData.length / leavesPerPage);

    // Function for handle approval of leave
    const handleApprove = async (leaveId) => {

        setLoading(true);
        try {
            const response = await makeRequest.patch(`/update-leave-status/${leaveId}`, {
                status: 'Approved'
            });
            if (response.data.success) {
                fetchLeaves();
            }
        } catch (error) {
            console.error('Error approving leave:', error);
        } finally {
            setLoading(false);
        }
    }

    // Function for handle rejection of leave
    const handleReject = async (leaveId) => {
        setLoading(true);
        try {
            const response = await makeRequest.patch(`/update-leave-status/${leaveId}`, {
                status: 'Rejected'
            });
            if (response.data.success) {
                fetchLeaves();
            }
        } catch (error) {
            console.error('Error approving leave:', error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {

        // Socket listner for the newLeaveRequest event
        socket.on('newLeaveRequest', (newLeave) => {
            setLeaves((prev) => [
                newLeave,
                ...prev
            ]);
        });

        // Clean up socket event listener
        return () => {
            socket.off('newLeaveRequest');
        }
    });

    return (

        <div className='p-4 bg-white mt-4 rounded-lg'>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold text-xl xs:text-2xl pb-4'>Leaves</h1>
                {/* Filter Options */}
                <div className='pb-2'>
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

            {/* Search box */}
            <div>
                <SearchBox value={searchTerm} onChange={handleSearch} />
            </div>

            {/* Table for large screens */}
            <div className='items-start hidden lg:flex'>
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-bb-theme-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Name</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Start Date</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">End Date</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Days</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Reason</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider w-40">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentPageLeaves.length > 0 ? currentPageLeaves.map((leave) => (
                            <tr key={leave._id} className='hover:bg-bb-theme-50 even:bg-gray-50'>
                                <td className="px-4 py-3 whitespace-nowrap">{leave.mechanicId.name}</td>
                                <td className="px-4 py-3">{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{leave.days}</td>
                                <td className="px-4 py-3">{leave.reason}</td>
                                <td className="px-4 py-3">
                                    {leave.status === 'Pending' ? (
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => handleApprove(leave._id)}
                                                className="bg-green-50 text-green-500 py-0.5 px-2 rounded-sm hover:bg-green-100"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(leave._id)}
                                                className="bg-red-50 text-red-500 py-0.5 px-2 rounded-sm hover:bg-red-100"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : leave.status === 'Approved' ? (
                                        <span className="text-green-500">Approved</span>
                                    ) : <span className="text-red-500">Rejected</span>}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-3 text-center">No leave records available</td>
                            </tr>


                        )}
                    </tbody>
                </table>
            </div>

            {/* Small screens */}
            <div className='flex flex-wrap gap-4 lg:hidden w-full'>
                {filteredData.length > 0 ? (
                    filteredData.map((leave) => (
                        <div key={leave._id} className="border p-4 rounded-lg w-full xs:w-[300px] min-w-[300px]">
                            <h1 className="text-lg font-semibold">{leave.mechanicId.name}</h1>
                            <div><strong className='font-medium text-gray-500 text-sm'>Start Date:</strong> {new Date(leave.startDate).toLocaleDateString()}</div>
                            <div><strong className='font-medium text-gray-500 text-sm'>End Date:</strong> {new Date(leave.endDate).toLocaleDateString()}</div>
                            <div><strong className='font-medium text-gray-500 text-sm'>Days:</strong> {leave.days}</div>
                            <div><strong className='font-medium text-gray-500 text-sm'>Reason:</strong> {leave.reason}</div>
                            <div><strong className='font-medium text-gray-500 text-sm'>Status: </strong>
                                {leave.status === 'Pending' ? (
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() => handleApprove(leave._id)}
                                            className="bg-green-50 text-green-500 py-1 px-2 rounded-sm hover:bg-green-100"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(leave._id)}
                                            className="bg-red-50 text-red-500 py-1 px-2 rounded-sm hover:bg-red-100"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : leave.status === 'Approved' ? (
                                    <span className="text-green-500">Approved</span>
                                ) : (
                                    <span className="text-red-500">Rejected</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No leave records available</p>
                )}
            </div>

            {/* Pagination component */}
            <div className='p-4 hidden lg:block'>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default LeavePage;
