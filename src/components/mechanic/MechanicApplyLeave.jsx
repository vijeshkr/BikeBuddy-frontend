import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import makeRequest from '../../common/axios';
import { toast } from 'react-toastify';
import { addLeave } from '../../redux/features/leavesSlice';

const MechanicApplyLeave = () => {
  // Get user details from the Redux store
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // States to manage user inputs
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [halfDay, setHalfDay] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');

  // State to manage loading
  const [loading, setLoading] = useState(false);

  // Handler function to toggle the checkbox state
  const handleCheckboxChange = (e) => {
    setHalfDay(e.target.checked);
  };

  // Handle on change for leave reason
  const handleLeaveReason = (e) => {
    setLeaveReason(e.target.value);
  }

  // Handle submit leave form
  const handlSubmit = async (e) => {
    e.preventDefault();

    // Construct the data object to sent to the server
    const data = {
      startDate,
      endDate,
      reason: leaveReason,
      halfDay
    }

    setLoading(true);
    try {

      const response = await makeRequest.post('/apply-leave', data);
      if (response.data.success) {
        toast.success(response.data.message);
        // Update the redux store with new leave data
        dispatch(addLeave(response.data.data));
        // Reset form fields
        setStartDate(null);
        setEndDate(null);
        setHalfDay(false);
        setLeaveReason('');
      }
    } catch (error) {
      console.error('Failed to apply leave:', error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handlSubmit}
        className='space-y-4'>
        <h1 className='font-semibold text-2xl'>Apply Leave</h1>

        {/* Display user name */}
        <div>
          <p className="text-sm mb-1 text-gray-400">Name</p>
          <h1 className='text-xl'>{user.name}</h1>
        </div>

        <div className='flex gap-4 flex-col xs:flex-row'>
          {/* Start date picker */}
          <div className="flex flex-col">
            <label
              className="text-sm mb-1 text-gray-400"
            >Start Date</label>
            <DatePicker
              selected={startDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => setStartDate(date)}
              required
              placeholderText="Select date"
              minDate={new Date()}
              className="text-sm outline-none bg-gray-100 p-2 rounded-md w-full"
            />
          </div>
          {/* End date picker */}
          <div className="flex flex-col">
            <label
              className="text-sm mb-1 text-gray-400"
            >End Date</label>
            <DatePicker
              selected={endDate}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => setEndDate(date)}
              required
              placeholderText="Select date"
              minDate={new Date()}
              className="text-sm outline-none bg-gray-100 p-2 rounded-md w-full"
            />
          </div>
        </div>
        {/* Checkbox for half day */}
        <div className='flex gap-2'>
          <label className='text-sm mb-1 text-gray-400'>Half Day</label>
          <div className='pt-0.5'>
            <input
              onChange={handleCheckboxChange}
              checked={halfDay}
              type="checkbox" />
          </div>
        </div>
        {/* Text area for leave reason */}
        <div className='flex flex-col'>
          <label className='text-sm mb-1 text-gray-400'>Leave Reason</label>
          <textarea
            value={leaveReason}
            onChange={handleLeaveReason}
            className='border h-32 rounded-md p-2 text-sm outline-none' placeholder='Reason for leave'></textarea>
        </div>
        {/* Submit button */}
        <button className='bg-primaryColor text-white py-1 px-8 rounded-md'>Apply</button>


      </form>
    </div>
  )
}

export default MechanicApplyLeave;