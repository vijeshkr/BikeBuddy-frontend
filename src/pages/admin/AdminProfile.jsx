import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import profilePlaceholder from '../../assets/profile.png';
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { FaMobileAlt } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";

const AdminProfile = () => {
  const user = useSelector((state) => state.user.user);

  // State for update photo toggle
  const [updatePhoto, setUpdatePhoto] = useState(false);

  // Update photo open close toggle function
  const openUpdatePhoto = () => {
    setUpdatePhoto(!updatePhoto);
  }
  return (
    <div>

      <h1 className='text-2xl font-semibold p-4'>User Profile</h1>

      <div className='flex flex-wrap gap-6 '>

        {/* Current user details  */}


        <div className='shadow-custom flex flex-col gap-4 flex-1 p-4 md:h-[470px]'>
          <div>
            <img className='h-36 w-36 object-cover rounded-full border' src={profilePlaceholder} alt="" />
          </div>

          <div className='flex flex-col gap-4'>
            <h1 className='text-xl font-semibold'>{user.name}</h1>

            <p className='text-sm text-gray-400 py-3'>Contact Details</p>

            <div className='flex items-center gap-2'>
              <span className='pt-1 text-lg'><IoMailOutline /></span>
              <p className='text-sm'>{user.email}</p>
            </div>

            <div className='flex items-center gap-2'>
              <span className='pt-1 text-lg'><FaMobileAlt /></span>
              <p className='text-sm'>{user.phone || '+9100000000000'}</p>
            </div>

            <div className='flex items-center gap-2'>
              <span className='pt-1 text-lg'><TbCurrentLocation /></span>
              <p className='text-sm'>{user.location || 'Location'}</p>
            </div>


          </div>

        </div>


        {/* Update profile */}
        <form className='flex flex-col gap-5 shadow-custom flex-1 p-4 md:h-[470px]'>



          <div className='relative flex'>

            <div className='relative inline-block'>
              <img className='h-36 w-36 object-cover rounded-full border' src={profilePlaceholder} alt="" />

              <span 
              onClick={openUpdatePhoto}
              className='text-2xl absolute bottom-0 right-0 border rounded-full p-2 bg-blue-100 active:bg-blue-200 cursor-pointer'>
                <FaCloudUploadAlt />
              </span>
            </div>

            {/* Profile pic update or remove */}
            <div className={`flex justify-center items-center gap-2 p-2 text-xs ${!updatePhoto ? `hidden` : ``}`}>

              <label className='border p-1 rounded-sm cursor-pointer bg-gray-100 hover:bg-gray-200 active:bg-gray-300'>Update photo
                <input type="file" className='hidden' />
              </label>
              <span className='border p-1 rounded-sm cursor-pointer bg-gray-100 hover:bg-gray-200 active:bg-gray-300'>Remove photo</span>
            </div>

          </div>






          <input value={user.name} className='border-b border-black p-2 outline-none text-sm' type="text" placeholder='Name' />
          <input value={user.email} className='border-b border-black p-2 outline-none text-sm' type="text" placeholder='Email' />
          <input value={user.phone} className='border-b border-black p-2 outline-none text-sm' type="text" placeholder='Phone' />
          <input value={user.location} className='border-b border-black p-2 outline-none text-sm' type="text" placeholder='Location' />

          <button className='border hover:bg-opacity-95 active:bg-primaryColor p-1 rounded-sm text-sm bg-primaryColor text-white'>Update profile</button>

        </form>


        {/* Reset password */}
        <div className='flex flex-col gap-6 shadow-custom flex-1 p-4 text-sm lg:h-[470px]'>
          <input className='border-b border-black p-2 outline-none' type="text" placeholder='Old password' />
          <input className='border-b border-black p-2 outline-none' type="text" placeholder='New password' />
          <input className='border-b border-black p-2 outline-none' type="text" placeholder='Confirm new password' />
          
          <button className='border hover:bg-opacity-95 active:bg-primaryColor p-1 rounded-sm text-sm bg-primaryColor text-white'>Reset password</button>
        </div>
      </div>

    </div>
  )
}

export default AdminProfile;