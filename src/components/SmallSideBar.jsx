import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../logo/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSideBar } from '../redux/features/sideBarOpenClose';
import { BsArrowLeftShort } from "react-icons/bs";

const SmallSideBar = ({ sidebarData }) => {
  // Getting the current sidebar state from the Redux store
  const smallSidebar = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handler for logo click event
  const logoClick = () => {
    // Toggle sidebar open/close state
    dispatch(setOpenSideBar(!smallSidebar));
    navigate('/');
  }

  return (
    <div className={`${smallSidebar ? '' : 'shadow-sidebar'} ${smallSidebar ? '-left-full' : 'left-0'} w-60
     md:hidden duration-300 h-screen flex flex-col justify-evenly py-5 pl-5 bg-white text-black absolute z-10 `}>

      {/* Sidebar toggle button */}
      <div className='relative'>
        <BsArrowLeftShort
          onClick={() => dispatch(setOpenSideBar(!smallSidebar))}
          className={`bg-white translate-x-full text-bb-theme-500 text-3xl rounded-full absolute right-4 top-0 border border-bb-theme-500 cursor-pointer`} />
      </div>

      {/* Logo and title */}
      <div onClick={logoClick} className={`flex flex-col gap-2 items-center top-3 left-10`}>
        <Logo width={'100'} height={'55'} color='#405de6'/>
        <h1 className='text-xl font-bold text-bb-theme-500'>Bike<span className='text-bb-theme-800'>Buddy</span></h1>
      </div>

      {/* Navigation links */}
      <div>
        {sidebarData.map((item, index) => (
          <NavLink onClick={() => dispatch(setOpenSideBar(!smallSidebar))} to={item.link} key={index} end={index === 0} className={({ isActive }) => `text-sm font-medium flex items-center gap-4 p-2.5 rounded-s-md mt-2 duration-200 hover:text-bb-theme-500 hover:bg-bb-theme-100 hover:border-r-4 hover:border-bb-theme-500
           ${isActive ? 'active' : 'text-text-soft'}`} >
            <span className='text-xl'>
              {item.icon}
            </span>
            <span className={`text-nowrap`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      <div className='h-20'>
      </div>
    </div>
  )
}

export default SmallSideBar;