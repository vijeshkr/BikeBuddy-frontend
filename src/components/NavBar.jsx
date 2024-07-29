import React, { useState } from 'react';
import { IoMailOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import profilePlaceholder from '../assets/profile.png';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../common/axios';
import { toast } from 'react-toastify';

const NavBar = () => {
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State for open close logout
    const [openLogout, setOpenLogout] = useState(false);

    // Toggle function for open close logout section
    const toggleLogoutSection = () => {
        setOpenLogout(!openLogout);
    }

    // Logout fuction
    const handleLogout = async () => {
        try {
            const response = await makeRequest.post('/logout');
            if(response.data.success){
                toast.success(response.data.message);
                navigate('/');
                dispatch(logout());
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='h-14 p-4 bg-white shadow-sm'>
        <div className='flex justify-between'>
        <div>
            <h1 className='font-semibold'>Hi, <span>{user.name}</span></h1>
        </div>
        <div className='flex gap-4 items-center'>
        <div className='relative cursor-pointer'>
            <IoMailOutline/>
            <div className='bg-red-600 h-1.5 w-1.5 rounded-full absolute top-0 -right-0.5'></div>
        </div>
        <div className='relative cursor-pointer'>
            <IoNotificationsOutline/>
            <div className='bg-red-600 h-1.5 w-1.5 rounded-full absolute top-0 right-0'></div>
        </div>
        <div onClick={toggleLogoutSection} className='cursor-pointer flex gap-2 text-sm relative'>
        <img className='h-7 w-7 rounded-full object-cover' src={profilePlaceholder} alt="" />
            {user.name}
            <div className={`${!openLogout ? 'hidden' : ''} flex flex-col absolute -bottom-24 -right-3 gap-1 shadow-sm bg-white p-2 w-32 rounded-sm`}>
                <span onClick={() => navigate('profile-page')} className='hover:bg-gray-100 active:bg-gray-200 p-2 rounded-sm'>My profile</span>
                <span onClick={handleLogout} className='hover:bg-gray-100 active:bg-gray-200 p-2 rounded-sm text-red-500'>Logout</span>
            </div>
        </div>
        </div>
        </div>
    </div>
  )
}

export default NavBar;