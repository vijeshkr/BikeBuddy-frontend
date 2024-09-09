import React, { useEffect } from 'react'
import SideBar from '../../components/SideBar';
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SiGooglecloudspanner } from "react-icons/si";
import { IoPeople } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { HiShoppingBag } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { Outlet } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import SmallSideBar from '../../components/SmallSideBar';
import makeRequest from '../../common/axios';
import { allNotifications } from '../../redux/features/notificationSlice';
import { useDispatch } from 'react-redux';

const AdminHome = () => {

  const dispatch = useDispatch();

  // Sidebar data 
  const adminSidebar = [
    { label: 'Dashboard', icon: <TbLayoutDashboardFilled />, link: '' },
    { label: 'Booking Page', icon: <FaRegCalendarAlt />, link: 'admin-booking' },
    { label: 'Services', icon: <SiGooglecloudspanner />, link: 'admin-service' },
    { label: 'Mechanics', icon: <IoPeople />, link: 'admin-mechanics' },
    { label: 'Customers', icon: <IoIosPeople />, link: 'admin-customers' },
    { label: 'Spare Parts', icon: <HiShoppingBag />, link: 'admin-spare-parts' },
    { label: 'Services History', icon: <FaHistory />, link: 'admin-service-history' },
    { label: 'Profile', icon: <CgProfile />, link: 'profile-page' },
  ];

      // Fetching all notifications from the backend
      useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const response = await makeRequest.get('/get-notifications');
            dispatch(allNotifications(response.data.data));
          } catch (error) {
            console.error('Failed to fetch notifications', error)
          }
        }
    
        fetchNotifications();
      },[]);

  return (
    <div className='h-screen w-full bg-slate-100 flex'>
      {/* Sidebar for navigation */}
      <aside>
        <div >
          <SmallSideBar sidebarData={adminSidebar} />
        </div>
        <SideBar sidebarData={adminSidebar} />
      </aside>

      <div className='w-full'>
        {/* Navbar section */}
        <nav >
          <NavBar />
        </nav>

        <div 
        className=' w-full h-h-calc flex sm:p-4 gap-5'>
          {/* Outlet */}
          <main 
          className='h-full flex-1 overflow-y-auto bg-white p-5 scrollbar-none'
          >
            <Outlet />
          </main>
        </div>


      </div>
    </div>
  )
}

export default AdminHome;