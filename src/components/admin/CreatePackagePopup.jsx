import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import makeRequest from '../../common/axios';
import { toast } from 'react-toastify';

const CreatePackagePopup = ({ close, fetchPackage }) => {

  // State for manage form data
  const [data, setData] = useState({
    packageName: '',
    description: '',
    suitable: '',
    price: 0,
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
      const response = await makeRequest.post('/add-package', data);
      if (response.data.success) {
        // Show a success message and call fetchPackage to refresh the data
        toast.success('Package added successfully');
        fetchPackage();
        close();
      }
    } catch (error) {
      console.error('Error while creating new package: ', error);
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
      <div className='bg-white p-4 rounded-md shadow-lg max-w-[340px]'>
        <div className='flex items-center justify-between'>
          <h1 className='py-3 font-semibold text-lg'>Create New Package</h1>
          <button
            onClick={close}
            className='pt-2'>
            <IoMdClose />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleOnChange}
            name='packageName'
            className='text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Package name' type="text" />
          <textarea
            onChange={handleOnChange}
            name='description'
            className='h-24 text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Description' type="text" />
          <input
            onChange={handleOnChange}
            name='price'
            className='text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Price' type="number" />
          <select
            onChange={handleOnChange}
            name='suitable'
            className='text-sm outline-none bg-gray-100 p-2 rounded-md mb-2 w-full'>
            <option value="Scooter">Select an option</option>
            <option value="Scooter">Scooter</option>
            <option value="Bike">Bike</option>
            <option value="Both">Both</option>
          </select>
          <button className='text-sm bg-primaryColor p-2 rounded-sm text-white w-full'>Create</button>
        </form>
      </div>
    </div>
  )
}

export default CreatePackagePopup
