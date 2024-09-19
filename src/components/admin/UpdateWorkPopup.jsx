import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import makeRequest from '../../common/axios';
import { toast } from 'react-toastify';

const UpdateWorkPopup = ({ close, wrk, fetchWorks }) => {

  // State for manage form data
  const [data, setData] = useState({
    _id: wrk._id,
    workName: wrk.workName,
    suitable: wrk.suitable,
    price: wrk.price,
  });

  // Handle change in the form
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await makeRequest.put('/update-individual-work', data);
      if (response.data.success) {
        toast.success('Work updated successfully');
        fetchWorks();
        close();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error while updating work: ', error);
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
      <div className='bg-white p-4 rounded-md shadow-lg max-w-[340px]'>
        <div className='flex items-center justify-between'>
          <h1 className='py-3 font-semibold text-lg'>Update Work</h1>
          <button
            onClick={close}
            className='pt-2'>
            <IoMdClose />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            value={data.workName}
            onChange={handleOnChange}
            name='workName'
            className='text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Work name' type="text" />
          <input
            value={data.price}
            onChange={handleOnChange}
            name='price'
            className='text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Price' type="number" />
          <select
            value={data.suitable}
            onChange={handleOnChange}
            name='suitable'
            className='text-sm outline-none bg-gray-100 p-2 rounded-md mb-2 w-full'>
            <option value={data.suitable}>{data.suitable}</option>
            {/* Conditional options based on current value */}
            {data.suitable !== 'Scooter' && <option value="Scooter">Scooter</option>}
            {data.suitable !== 'Bike' && <option value="Bike">Bike</option>}
            {data.suitable !== 'Both' && <option value="Both">Both</option>}
          </select>
          <button className='p-2 rounded-md text-sm text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm w-full'>Update</button>
        </form>
      </div>
    </div>
  )
}

export default UpdateWorkPopup;
