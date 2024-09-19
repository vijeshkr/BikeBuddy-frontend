import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BsArrowLeftShort } from "react-icons/bs";
import Logo from '../logo/Logo';

const SideBar = ({ sidebarData }) => {

  // State to manage sidebar open/close state
  const [open, setOpen] = useState(true);

  return (
    <div className={`${open ? 'w-60' : 'w-20'}
     hidden duration-300 h-screen md:flex flex-col justify-center py-5 pl-5 bg-white text-black relative`}>

      {/* Logo for closed sidebar, only displayed when sidebar is close */}
      <div className={`${open && 'hidden'} absolute top-[42px] left-5`}>
        <Logo width={'35'} height={'18'} color='#405de6' />
      </div>

      {/* Logo and title for the opened sidebar, only displayed when sidebar is open */}
      <div className={`${!open && 'hidden'} flex flex-col gap-2 items-center absolute top-3 left-10`}>
        <Logo width={'132'} height={'70'} color='#405de6' />
        <h1 className='text-xl font-bold text-bb-theme-500'>Bike<span className='text-bb-theme-800'>Buddy</span></h1>
      </div>

      {/* Toggle button to open/close sidebar */}
      <BsArrowLeftShort
        onClick={() => setOpen(!open)}
        className={`
            ${!open && 'rotate-180'}
        bg-white text-bb-theme-500 text-3xl rounded-full absolute -right-3 top-9 border border-bb-theme-500 cursor-pointer`} />

      {/* Sidebar navigation links */}
      {sidebarData.map((item, index) => (
        <NavLink to={item.link} key={index} end={index === 0} 
        className={({ isActive }) => `text-sm font-medium flex items-center gap-4 p-2.5 rounded-s-md mt-2 duration-200 hover:text-bb-theme-500 hover:bg-bb-theme-100 hover:border-r-4 hover:border-bb-theme-500 
        ${isActive ? 'active' : 'text-text-soft'}`} >
          <span className='text-xl'>
            {item.icon}
          </span>
          <span className={`${!open && 'hidden'} text-nowrap `}>
            {item.label}
          </span>
        </NavLink>
      ))}
    </div>
  )
}

export default SideBar;