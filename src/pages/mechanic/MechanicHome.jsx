import React, { useEffect } from 'react';
import { SiGooglecloudspanner } from "react-icons/si";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { HiShoppingBag } from "react-icons/hi2";
import SmallSideBar from '../../components/SmallSideBar';
import SideBar from '../../components/SideBar';
import NavBar from '../../components/NavBar';
import { Outlet } from 'react-router-dom';
import makeRequest from '../../common/axios';
import { allNotifications } from '../../redux/features/notificationSlice';
import { useDispatch } from 'react-redux';

const MechanicHome = () => {

  const dispatch = useDispatch();

  // Sidebar data 
  const mechanicSidebar = [
    { label: 'Dashboard', icon: <SiGooglecloudspanner />, link: '' },
    { label: 'Leave', icon: <FaRegCalendarXmark />, link: 'mechanic-leave' },
    { label: 'Services History', icon: <FaHistory />, link: 'mechanic-service-history' },
    { label: 'Spare Parts', icon: <HiShoppingBag />, link: 'mechanic-spare-parts' },
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
  }, []);
  return (
    <div className='h-screen w-full bg-bg-color flex'>
      {/* Sidebar for navigation */}
      <aside>
        <div >
          <SmallSideBar sidebarData={mechanicSidebar} />
        </div>
        <SideBar sidebarData={mechanicSidebar} />
      </aside>

      <div className='w-full'>

        {/* Navbar section */}
        <nav >
          <NavBar />
        </nav>

        <div className=' w-full h-h-calc flex gap-5'>
          {/* Outlet */}
          <main className='h-full flex-1 overflow-y-auto p-5 scrollbar-none'>
            <Outlet />
          </main>
        </div>
        
      </div>
    </div>
  )
}

export default MechanicHome;