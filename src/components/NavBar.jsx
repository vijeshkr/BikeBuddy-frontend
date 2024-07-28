import React from 'react';
import { IoMailOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';

const NavBar = () => {
    const user = useSelector((state) => state.user.user);
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
        <div className='cursor-pointer'>
            {user.name}
        </div>
        </div>
        </div>
    </div>
  )
}

export default NavBar;