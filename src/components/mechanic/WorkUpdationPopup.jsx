import React, { useEffect, useState } from 'react';
import { updateAllocationStatus, updateExtraWork } from '../../redux/features/allocationsSlice';
import { toast } from 'react-toastify';
import makeRequest from '../../common/axios';
import { useDispatch } from 'react-redux';

const WorkUpdationPopup = ({ close, allocation }) => {
    // State to manage opening animation of the popup
    const [isOpen, setIsOpen] = useState(false);
    // State to manage status
    const [status, setStatus] = useState('');
    // State for manage loading
    const [loading, setLoading] = useState(false);
    // State to manage work description
    const [description, setDescription] = useState('');
    // State to manage estimation amount
    const [amount, setAmount] = useState(0);

    const dispatch = useDispatch();

    // Handler for status change
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    }
    // Handler for description change
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }
    // Handler for amount change
    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    }

    // Function for update booking status in the DB
    const updateStatus = async () => {
        const data = {
            status,
            bookingId: allocation.bookingId
        }
        setLoading(true);
        try {
            // API call
            const response = await makeRequest.patch(`/update-status`, data);
            if (response.data.success) {
                // Update in the Redux store
                dispatch(updateAllocationStatus(data));
                toast.success('Status updated successfully');
                // Close the popup
                setIsOpen(false);
                setTimeout(close, 300);
            }
        } catch (error) {
            console.error('Error while update status ', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    // Function for request extra work
    const requestExtraWork = async () => {
        const data = {
            description,
            amount
        }
        setLoading(true);
        try {
            // API call
            const response = await makeRequest.patch(`/request-work/${allocation._id}`, data);
            if (response.data.success) {
                // Update in the Redux store
                dispatch(updateExtraWork(response.data.data));
                toast.success('Work requested successfully');
                // Close the popup
                setIsOpen(false);
                setTimeout(close, 300);
            }
        } catch (error) {
            console.error('Error while request work ', error);
            toast.error(error.response.data.message);
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
                <div className="p-4 xs:p-10 bg-white rounded-md shadow-custom max-w-lg mx-auto min-w-[320px]">

                    {/* Title and close button */}
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl text-center sm:text-left sm:text-2xl font-semibold mb-4 ">Update work</h2>
                        <span
                            className='text-black text-2xl pb-2 cursor-pointer'
                            onClick={() => {
                                setIsOpen(false);
                                setTimeout(close, 300); // Close after animation
                            }}
                        >&times;</span>
                    </div>

                    {/* Status updation */}
                    <div className='mb-6 shadow-custom p-4 rounded-md'>
                        <h3 className='text-sm text-left sm:text-lg font-semibold mb-2'>Update Status</h3>
                        <div className='flex justify-between'>
                            <select
                                onChange={handleStatusChange}
                                className="text-sm outline-none bg-purple-100 p-2 rounded-md">
                                <option value=''>Select status</option>
                                {allocation.bookingId?.status !== 'Progress' && <option value='Progress'>In Progress</option>}
                                {allocation.bookingId?.status !== 'Pending' && <option value='Pending'>Pending</option>}
                            </select>
                            <button
                                onClick={() => updateStatus()}
                                className='bg-purple-400 hover:bg-purple-500 px-3 py-1 rounded-md text-white'>Update</button>
                        </div>
                    </div>

                    {/* Extra work request */}
                    <div className='mb-6 shadow-custom p-4 rounded-md'>
                        <h3 className='text-sm text-left sm:text-lg font-semibold mb-2'>Work Request</h3>
                        <div className='flex flex-col gap-2'>
                            <textarea
                                onChange={handleDescriptionChange}
                                className='border h-16 rounded-md p-2 text-sm outline-none resize-none bg-gray-100'
                                placeholder='Work description'
                            ></textarea>
                            <input
                                onChange={handleAmountChange}
                                className='border rounded-md p-2 outline-none bg-gray-100 text-sm'
                                placeholder='Estimation amount'
                                type="number" />

                            <button 
                            onClick={() => requestExtraWork()}
                            className='bg-purple-400 hover:bg-purple-500 px-3 py-1 rounded-md text-white'>Request</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkUpdationPopup;