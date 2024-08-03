import React from 'react';
import { IoMdClose } from "react-icons/io";

const CreatePackagePopup = ({ close }) => {
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
        <input className='text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Package name' type="text" />
        <textarea className='text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Description' type="text" />
        <input className='text-sm outline-none border p-2 rounded-md mb-2 w-full' placeholder='Price' type="number" />
        <select className='text-sm outline-none bg-gray-100 p-2 rounded-md mb-2 w-full'>
          <option value="Scooter">Scooter</option>
          <option value="Bike">Bike</option>
          <option value="Both">Both</option>
        </select>
        <button className='text-sm bg-primaryColor p-2 rounded-sm text-white w-full'>Create</button>
      </div>
    </div>
  )
}

export default CreatePackagePopup
