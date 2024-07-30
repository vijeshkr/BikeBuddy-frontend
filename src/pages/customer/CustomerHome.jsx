import React from 'react';
import { FaMotorcycle } from "react-icons/fa";
import { SiGooglecloudspanner } from "react-icons/si";
import { FaHistory } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import SmallSideBar from '../../components/SmallSideBar';
import SideBar from '../../components/SideBar';
import NavBar from '../../components/NavBar';
import { Outlet } from 'react-router-dom';

const CustomerHome = () => {
  // Sidebar data 
  const customerSidebar = [
    {label: 'Services', icon: <SiGooglecloudspanner/>, link:''},
    {label: 'Services History', icon: <FaHistory/>, link:'user-service-history'},
    {label: 'My Vehicle', icon: <FaMotorcycle/>, link:'user-vehicle'},
    {label: 'Profile', icon: <CgProfile/>, link:'profile-page'},
    
  ];
  return (
    <div className='h-screen w-full bg-slate-100 flex'>
      {/* Sidebar for navigation */}
        <aside>
          <div >
          <SmallSideBar sidebarData={customerSidebar} />
          </div>
          <SideBar sidebarData={customerSidebar}/>
        </aside>

        <div className='w-full'>

            <nav >
                <NavBar/>
            </nav>

            <div className=' w-full h-h-calc flex sm:p-4 gap-5'>
              {/* Outlet */}
                <main className='h-full flex-1 overflow-y-auto bg-white p-5 scrollbar-none'>
                <Outlet/>
                </main>

                {/* <aside className='h-full w-72 bg-white p-5'>Rightbar</aside> */}
            </div>


        </div>
    </div>
  )
}

export default CustomerHome;