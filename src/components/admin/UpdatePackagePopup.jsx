import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import makeRequest from '../../common/axios';
import { toast } from 'react-toastify';

const UpdatePackagePopup = ({ close, pkg, fetchPackage }) => {

  // State for manage form data
  const [data, setData] = useState({
    _id: pkg._id,
    packageName: pkg.packageName,
    description: pkg.description,
    suitable: pkg.suitable,
    price: pkg.price,
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
      const response = await makeRequest.put('/update-package', data);
      if (response.data.success) {
        // Show success message and close the popup
        toast.success('Package updated successfully');
        fetchPackage();
        close();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error while updating package: ', error);
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
      <div className='bg-white p-4 rounded-md shadow-lg max-w-[340px]'>
        <div className='flex items-center justify-between'>
          <h1 className='py-3 font-semibold text-lg'>Update Package</h1>
          <button
            onClick={close}
            className='pt-2'>
            <IoMdClose />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            value={data.packageName}
            onChange={handleOnChange}
            name='packageName'
            className='text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Package name' type="text" />
          <textarea
            value={data.description}
            onChange={handleOnChange}
            name='description'
            className='h-24 text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Description' type="text" />
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

export default UpdatePackagePopup
