import React from 'react'
import SideBar from '../../components/SideBar';
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TiSpanner } from "react-icons/ti";
import { SiGooglecloudspanner } from "react-icons/si";
import { IoPeople } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { HiShoppingBag } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { Outlet } from 'react-router-dom';

const AdminHome = () => {

  // Sidebar data 
  const adminSidebar = [
    {label: 'Monthly Tracker', icon: <TbLayoutDashboardFilled/>, link:''},
    {label: 'Booking Page', icon: <FaRegCalendarAlt/>, link:'admin-booking'},
    {label: 'Breakdown', icon: <TiSpanner/>, link:'admin-breakdown'},
    {label: 'Services', icon: <SiGooglecloudspanner/>, link:'admin-service'},
    {label: 'Mechanics', icon: <IoPeople/>, link:'admin-mechanics'},
    {label: 'Customers', icon: <IoIosPeople/>, link:'admin-customers'},
    {label: 'Spare Parts', icon: <HiShoppingBag/>, link:'admin-spare-parts'},
    {label: 'Services History', icon: <FaHistory/>, link:'admin-service-history'},
    {label: 'Profile', icon: <CgProfile/>, link:'admin-profile'},
  ];

  return (
    <div className='h-screen w-full bg-slate-500 flex'>
      {/* Sidebar for navigation */}
        <aside>
          <SideBar sidebarData={adminSidebar}/>
        </aside>

        <div className='w-full'>

            <nav className='bg-white h-16'>
                Navbar
            </nav>

            <div className='bg-gray-200 w-full h-full flex p-5 gap-5'>
              {/* Outlet */}
                <main className='h-full flex-1'>
                <Outlet/>
                </main>

                <aside className='h-full bg-green-700'>Rightbar</aside>
            </div>


        </div>
    </div>
  )
}

export default AdminHome;