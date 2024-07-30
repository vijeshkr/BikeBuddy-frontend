import React from 'react';
import { SiGooglecloudspanner } from "react-icons/si";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { HiShoppingBag } from "react-icons/hi2";
import SmallSideBar from '../../components/SmallSideBar';
import SideBar from '../../components/SideBar';
import NavBar from '../../components/NavBar';
import { Outlet } from 'react-router-dom';

const MechanicHome = () => {

  // Sidebar data 
  const mechanicSidebar = [
    { label: 'Job', icon: <SiGooglecloudspanner />, link: '' },
    { label: 'Leave', icon: <FaRegCalendarXmark />, link: 'mechanic-leave' },
    { label: 'Services History', icon: <FaHistory />, link: 'mechanic-service-history' },
    {label: 'Spare Parts', icon: <HiShoppingBag/>, link:'mechanic-spare-parts'},
    { label: 'Profile', icon: <CgProfile />, link: 'profile-page' },

  ];
  return (
    <div className='h-screen w-full bg-slate-100 flex'>
      {/* Sidebar for navigation */}
      <aside>
        <div >
          <SmallSideBar sidebarData={mechanicSidebar} />
        </div>
        <SideBar sidebarData={mechanicSidebar} />
      </aside>

      <div className='w-full'>

        <nav >
          <NavBar />
        </nav>

        <div className=' w-full h-h-calc flex sm:p-4 gap-5'>
          {/* Outlet */}
          <main className='h-full flex-1 overflow-y-auto bg-white p-5 scrollbar-none'>
            <Outlet />
          </main>

          {/* <aside className='h-full w-72 bg-white p-5'>Rightbar</aside> */}
        </div>


      </div>
    </div>
  )
}

export default MechanicHome;