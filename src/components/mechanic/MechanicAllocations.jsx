import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AllocationDetailsPopup from './AllocationDetailsPopup';
import WorkUpdationPopup from './WorkUpdationPopup';
import WorkCompletionPopup from './WorkCompletionPopup';

const MechanicAllocations = () => {

    // State to open/close handle booking details popup
    const [openAllocationDetails, setOpenAllocationDetails] = useState(false)
    // State to open/close handle booking details popup
    const [openUpdatePopup, setOpenUpdatePopup] = useState(false)
    // State to open/close handle complete booking popup
    const [openCompletePopup, setOpenCompletePopup] = useState(false)
    // State to manage selected booking
    const [selectedAllocation, setSelectedAllocation] = useState(null);

    // Access allocation details from the Redux store
    const allocations = useSelector((state) => state.allocations.allocations);

    // Handle selected booking
    const handleSelectedAllocation = (allocationId) => {
        const allocation = allocations.find(allocation => allocation._id === allocationId);
        setSelectedAllocation(allocation);
    };

    // Handle open allocation details popup
    const openHandleAllocationDetails = () => {
        setOpenAllocationDetails((prev) => !prev);
    };

    // Handle close allocation details popup
    const closeHandleAllocationDetails = () => {
        setOpenAllocationDetails((prev) => !prev);
    };

    // Handle open update popup
    const openHandleUpdatePopup = () => {
        setOpenUpdatePopup((prev) => !prev);
    };

    // Handle close update popup
    const closeHandleUpdatePopup = () => {
        setOpenUpdatePopup((prev) => !prev);
    };

    // Handle open update popup
    const openHandleCompletePopup = () => {
        setOpenCompletePopup((prev) => !prev);
    };

    // Handle close update popup
    const closeHandleCompletePopup = () => {
        setOpenCompletePopup((prev) => !prev);
    };

    return (
        <div className="p-2 lg:shadow-custom rounded-md">
            <h3 className="text-xl sm:text-2xl text-center sm:text-left font-semibold mb-4">Allocatted Jobs</h3>
            {allocations.length === 0 ? (
                <p className="text-gray-500">No allocations available.</p>
            ) : (
                <div>
                    {/* Table format for larger screens */}
                    <table className="hidden lg:table w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                                {/* <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th> */}
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allocations.map((allocation) => (
                                <tr key={allocation._id} className="hover:bg-gray-50">
                                    <td
                                        onClick={() => {
                                            handleSelectedAllocation(allocation._id);
                                            openHandleAllocationDetails();
                                        }}
                                        className="px-4 py-3 cursor-pointer">
                                        {allocation?.bookingId?.vehicleId?.registrationNumber}
                                    </td>
                                    <td className={`px-4 py-3 ${allocation.bookingId.breakdown && 'text-red-600'}`}>
                                        {allocation.bookingId?.breakdown ? 'Breakdown' : allocation.bookingId?.serviceType?.packageName}
                                    </td>
                                    <td className={`px-4 py-3 ${allocation.customerApproval === 'Pending' ? 'text-yellow-400' :
                                        allocation.customerApproval === 'Approved' ? 'text-green-600' :
                                            allocation.customerApproval === 'Rejected' ? 'text-red-600' : 'text-gray-400'}`}>
                                        {allocation.customerApproval ? allocation.customerApproval : 'No request'}
                                    </td>
                                    {/* <td className="px-4 py-3">
                                        {new Date(allocation.bookingId.bookingDate).toLocaleDateString()}
                                    </td> */}
                                    <td className={`px-4 py-3
                                        ${allocation.bookingId.status === 'Allocated' && 'text-gray-400'}
                                        ${allocation.bookingId.status === 'Pending' && 'text-yellow-400'}
                                        ${allocation.bookingId.status === 'Progress' && 'text-cyan-500'}
                                        ${allocation.bookingId.status === 'Cancelled' && 'text-red-600'}
                                        ${allocation.bookingId.status === 'Completed' && 'text-green-600'}`}>
                                        {allocation.bookingId.status}
                                    </td>
                                    <td>
                                        {
                                            allocation.bookingId?.status === 'Completed' || allocation.bookingId?.status === 'Unpaid' || allocation.bookingId?.status === 'Paid' ? (<span className='text-gray-400'>No Action</span>) :
                                                (<div className="px-4 py-3 flex gap-2 items-center">
                                                    <button
                                                        onClick={() => {
                                                            handleSelectedAllocation(allocation._id);
                                                            openHandleUpdatePopup();
                                                        }}
                                                        className={`text-sm bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500 transition duration-300`}>
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleSelectedAllocation(allocation._id);
                                                            openHandleCompletePopup();
                                                        }}
                                                        className={`text-sm bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500 transition duration-300`}>
                                                        Complete
                                                    </button>
                                                </div>)
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Card format for mobile devices */}
                    <div className="lg:hidden">
                        {allocations.map((allocation) => (
                            <div key={allocation._id} className="bg-white text-sm sm:text-base shadow-custom rounded-lg p-4 mb-4 border border-gray-200">
                                <div className="mb-2">
                                    <span className="font-medium">Vehicle:</span> {allocation.bookingId?.vehicleId?.registrationNumber}
                                </div>
                                {
                                    allocation.bookingId?.place && <div className="mb-2">
                                        <span className='font-medium'>Place:</span> {allocation.bookingId?.place}
                                    </div>
                                }
                                {
                                    allocation.bookingId?.phone && <div className="mb-2">
                                        <span className='font-medium'>Phone:</span> {allocation.bookingId?.phone}
                                    </div>
                                }
                                {
                                    allocation.bookingId?.description &&
                                    <div className="mb-2">
                                        <div className='font-medium underline'>Job description:</div>
                                        <div className='w-[300px] text-gray-500'>
                                            {allocation.bookingId?.description}
                                        </div>
                                    </div>
                                }
                                <div className={`mb-2 ${allocation.bookingId.breakdown && 'text-red-600'}`}>
                                    <span className="font-medium text-black">Service Type:</span> {allocation.bookingId.breakdown ? 'Breakdown' : allocation.bookingId.serviceType?.packageName}
                                </div>
                                <div className="mb-2">
                                    <span className="font-medium">Booking Date:</span> {new Date(allocation.bookingId.bookingDate).toLocaleDateString()}
                                </div>
                                {/* Extra work request details */}
                                {allocation.extraWorkDescription &&
                                    <div>
                                        <div className="mb-4 max-w-[450px]">
                                            <span className="font-semibold text-text-sm sm:text-base underline">Work Request Description:</span>
                                            <div className=" text-gray-700">{allocation.extraWorkDescription}</div>
                                        </div>
                                        <div className="mb-4">
                                            <span className="font-semibold text-text-sm sm:text-base ">Extra estimation amount:</span>
                                            <span className=" text-gray-700 ml-4">{allocation.extraWorkEstimationAmount}</span>
                                        </div>
                                        <div className="mb-4">
                                            <span className="font-semibold text-text-sm sm:text-base ">Customer Approval Status:</span>
                                            <span className={`ml-4 ${allocation.customerApproval === 'Pending' ? 'text-yellow-500' :
                                                allocation.customerApproval === 'Approved' ? 'text-green-600' : 'text-red-600'}
                            }`}>{allocation.customerApproval}</span>
                                        </div>
                                    </div>
                                }
                                <div className={`mb-2
                                    ${allocation.bookingId.status === 'Allocated' && 'text-gray-400'}
                                    ${allocation.bookingId.status === 'Pending' && 'text-yellow-400'}
                                    ${allocation.bookingId.status === 'Progress' && 'text-cyan-500'}
                                    ${allocation.bookingId.status === 'Cancelled' && 'text-red-600'}
                                    ${allocation.bookingId.status === 'Completed' && 'text-green-600'}`}>
                                    <span className="font-medium text-black">Status:</span> {allocation.bookingId.status}
                                </div>
                                <div className="mb-2">
                                    <span className='font-medium'>Action: </span>
                                    <div>
                                    {
                                            allocation.bookingId?.status === 'Completed' || allocation.bookingId?.status === 'Unpaid' || allocation.bookingId?.status === 'Paid' ? (<span className='text-gray-400'>No Action</span>) :
                                                (<div className="px-4 py-3 flex gap-2 items-center">
                                                    <button
                                                        onClick={() => {
                                                            handleSelectedAllocation(allocation._id);
                                                            openHandleUpdatePopup();
                                                        }}
                                                        className={`text-sm bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500 transition duration-300`}>
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleSelectedAllocation(allocation._id);
                                                            openHandleCompletePopup();
                                                        }}
                                                        className={`text-sm bg-green-400 text-white px-3 py-1 rounded hover:bg-green-500 transition duration-300`}>
                                                        Complete
                                                    </button>
                                                </div>)
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {openAllocationDetails && <AllocationDetailsPopup close={closeHandleAllocationDetails} allocation={selectedAllocation} />}
            {openUpdatePopup && <WorkUpdationPopup close={closeHandleUpdatePopup} allocation={selectedAllocation} />}
            {openCompletePopup && <WorkCompletionPopup close={closeHandleCompletePopup} allocation={selectedAllocation} />}
        </div>
    )
}

export default MechanicAllocations;