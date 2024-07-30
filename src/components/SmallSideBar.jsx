import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../logo/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSideBar } from '../redux/features/sideBarOpenClose';
import { BsArrowLeftShort } from "react-icons/bs";

const SmallSideBar = ({ sidebarData }) => {
  // Sidebar open close state for small devices
  const smallSidebar = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const logoClick = () => {
    dispatch(setOpenSideBar(!smallSidebar));
    navigate('/');
  }

  return (
    <div className={`${smallSidebar ? '' : 'shadow-sidebar'} ${smallSidebar ? '-left-full' : 'left-0'} w-60
     md:hidden duration-300 h-screen flex flex-col justify-evenly p-5 bg-primaryColor text-white absolute z-10 `}>

      <div className='relative'>
        <BsArrowLeftShort
          onClick={() => dispatch(setOpenSideBar(!smallSidebar))}
          className={`bg-white translate-x-full text-primaryColor text-3xl rounded-full absolute right-0 top-0 border border-primaryColor cursor-pointer`} />
      </div>

      <div onClick={logoClick} className={`flex flex-col gap-2 items-center top-3 left-10`}>
        <Logo width={'100'} height={'55'} />
        <h1 className='text-xl font-semibold'>Bike<span className='text-black'>Buddy</span></h1>
      </div>

      <div>
        {sidebarData.map((item, index) => (
          <NavLink onClick={() => dispatch(setOpenSideBar(!smallSidebar))} to={item.link} key={index} end className={({ isActive }) => `flex items-center gap-4 p-2 rounded-md mt-2 duration-200 ${isActive ? 'active' : ''}`} >
            <span className='text-2xl'>
              {item.icon}
            </span>
            <span className={`text-nowrap text-sm`}>
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