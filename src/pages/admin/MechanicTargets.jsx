import React, { useState } from 'react';
import MechanicTargetForm from '../../components/admin/MechanicTargetForm';

const MechanicTargets = () => {
    // State for the visibility of add new mechanic targets form
    const [openAddNewTargets, setOpenAddNewTargets] = useState(false);

    // Toggle visibility of the add new mechanic targets popup
  const handleOpenNewTargetPopup = () => {
    setOpenAddNewTargets(!openAddNewTargets);
  }

  // Close the service add new mechanic targets popup
  const handleCloseNewTargetPopup = () => {
    setOpenAddNewTargets(prev => !prev);
  }

    return (

        <div className='py-4'>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold text-xl xs:text-2xl pb-4'>Targets</h1>
                {/* Filter Options */}
                <div className='pb-2 flex gap-4'>
                    <div>
                        <label htmlFor='statusFilter' className='mr-2 text-xs xs:text-sm text-slate-400'>Filter by status:</label>
                        <select
                            id='statusFilter'
                            className='bg-primaryColor cursor-pointer outline-none text-xs xs:text-sm text-white p-1 rounded-sm'
                        >
                            <option value='All'>All</option>
                            <option value='Pending'>Pending</option>
                            <option value='Approved'>Approved</option>
                            <option value='Rejected'>Rejected</option>
                        </select>
                    </div>
                    {/* Add new mechanic button */}
                    <button 
                    onClick={handleOpenNewTargetPopup}
                    className='py-1 px-2 bg-primaryColor hover:bg-opacity-95 text-white rounded-md'>
                        Add new mechanic
                    </button>
                </div>
            </div>

            {/* Table for large screens */}
            <div className='lg:overflow-y-auto lg:scrollbar-none xl:h-[485px] items-start hidden lg:flex'>
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labour Target</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labour Achievements</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spare Target</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Spare Achievements</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incentive</th>
                        </tr>
                    </thead>
                    {/* <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.length > 0 ? filteredData.map((leave) => (
                            <tr key={leave._id}>
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
                    </tbody> */}
                </table>
            </div>

            {/* Small screens */}
            {/* <div className='flex flex-wrap gap-4 lg:hidden w-full'>
                {filteredData.length > 0 ? (
                    filteredData.map((leave) => (
                        <div key={leave._id} className="border p-4 rounded-md shadow-custom w-full xs:w-[300px] min-w-[300px]">
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
            </div> */}

        {openAddNewTargets && <MechanicTargetForm close={handleCloseNewTargetPopup}/>}
        </div>
    );
};

export default MechanicTargets;
