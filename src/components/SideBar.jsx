import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BsArrowLeftShort } from "react-icons/bs";
import Logo from '../logo/Logo';

const SideBar = ({ sidebarData }) => {

  // State to manage sidebar open/close state
  const [open, setOpen] = useState(true);

  return (
    <div className={`${open ? 'w-60' : 'w-20'}
     hidden duration-300 h-screen md:flex flex-col justify-center p-5 bg-primaryColor text-white relative`}>

      {/* Logo for closed sidebar, only displayed when sidebar is close */}
      <div className={`${open && 'hidden'} absolute top-[42px] left-5`}>
        <Logo width={'35'} height={'18'} />
      </div>

      {/* Logo and title for the opened sidebar, only displayed when sidebar is open */}
      <div className={`${!open && 'hidden'} flex flex-col gap-2 items-center absolute top-3 left-10`}>
        <Logo width={'132'} height={'70'} />
        <h1 className='text-xl font-semibold'>Bike<span className='text-black'>Buddy</span></h1>
      </div>

      {/* Toggle button to open/close sidebar */}
      <BsArrowLeftShort
        onClick={() => setOpen(!open)}
        className={`
            ${!open && 'rotate-180'}
        bg-white text-primaryColor text-3xl rounded-full absolute -right-3 top-9 border border-primaryColor cursor-pointer`} />

      {/* Sidebar navigation links */}
      {sidebarData.map((item, index) => (
        <NavLink to={item.link} key={index} end={index === 0} className={({ isActive }) => `flex items-center gap-4 p-2 rounded-md mt-2 duration-200 ${isActive ? 'active' : ''}`} >
          <span className='text-2xl'>
            {item.icon}
          </span>
          <span className={`${!open && 'hidden'} text-nowrap`}>
            {item.label}
          </span>
        </NavLink>
      ))}
    </div>
  )
}

export default SideBar;