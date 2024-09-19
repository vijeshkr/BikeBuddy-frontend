import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateCustomerApproval } from '../../redux/features/currentBookingSlice';

const CustomerWorkApproval = ({ close, allocation }) => {
    // State to manage opening animation of the popup
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    // Handle approval function
    const handleApproval = async (status) => {
        setLoading(true);
        try {
            const response = await makeRequest.patch(`/update-customer-approval/${allocation._id}`, { customerApproval: status });
            if (response.data.success) {
                // Update the Redux state
                dispatch(updateCustomerApproval(response.data.data));
                toast.success(`New work request has ${status}`);
            }
        } catch (error) {
            console.error('Error while updating customer approval', error);
        } finally {
            setLoading(false);
        }
    }

    // Trigger the opening animation when the component mounts
    useEffect(() => {
        setIsOpen(true);
    }, []);
    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`flex justify-center items-center sm:block p-4 sm:p-10 rounded-md w-full h-full transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}>
                <div className="p-4 xs:p-10 bg-white rounded-lg shadow-custom max-w-lg mx-auto min-w-[320px]">

                    {/* Title and close button */}
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl text-center sm:text-left sm:text-2xl font-semibold mb-4 ">Additional Work Request</h2>
                        <span
                            className='text-black text-2xl pb-2 cursor-pointer'
                            onClick={() => {
                                setIsOpen(false);
                                setTimeout(close, 300); // Close after animation
                            }}
                        >&times;</span>
                    </div>
                    {/* Work description and amount */}
                    <div className='mb-6 border p-4 rounded-md max-h-[450px] overflow-y-auto scrollbar-none'>
                        <div className='space-y-2'>
                            <p className='text-lg font-medium'>Description</p>
                            <p>{allocation.extraWorkDescription}</p>
                            <p><span className='text-lg font-medium'>Estimation amount :</span> &#8377; {allocation.extraWorkEstimationAmount}</p>
                        </div>
                        <div className='flex justify-center gap-4 my-4'>
                            <button
                                onClick={() => {
                                    handleApproval('Approved')
                                    setIsOpen(false);
                                    setTimeout(close, 300);
                                }}
                                disabled={loading}
                                className='bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700'>Approve</button>
                            <button
                                onClick={() => {
                                    handleApproval('Rejected')
                                    setIsOpen(false);
                                    setTimeout(close, 300);
                                }}
                                disabled={loading}
                                className='bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700'>Reject</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CustomerWorkApproval;