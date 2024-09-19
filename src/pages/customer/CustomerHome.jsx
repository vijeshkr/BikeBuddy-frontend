import React, { useEffect } from 'react';
import { FaMotorcycle } from "react-icons/fa";
import { SiGooglecloudspanner } from "react-icons/si";
import { FaHistory } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import SmallSideBar from '../../components/SmallSideBar';
import SideBar from '../../components/SideBar';
import NavBar from '../../components/NavBar';
import { Outlet } from 'react-router-dom';
import makeRequest from '../../common/axios';
import { allNotifications } from '../../redux/features/notificationSlice';
import { useDispatch } from 'react-redux';

const CustomerHome = () => {

  const dispatch = useDispatch();

  // Sidebar data 
  const customerSidebar = [
    { label: 'Services', icon: <SiGooglecloudspanner />, link: '' },
    { label: 'Services History', icon: <FaHistory />, link: 'user-service-history' },
    { label: 'My Vehicle', icon: <FaMotorcycle />, link: 'user-vehicle' },
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
    <div className='h-screen w-full bg-bg-color flex'>
      {/* Sidebar for navigation */}
      <aside>
        <div >
          <SmallSideBar sidebarData={customerSidebar} />
        </div>
        <SideBar sidebarData={customerSidebar} />
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

export default CustomerHome;