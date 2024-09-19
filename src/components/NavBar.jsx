import React, { useState } from 'react';
import { IoMailOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import profilePlaceholder from '../assets/profile.png';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../common/axios';
import { toast } from 'react-toastify';
import { logout } from '../redux/features/userSlice';
import { IoReorderThreeSharp } from "react-icons/io5";
import { setOpenSideBar } from '../redux/features/sideBarOpenClose';
import Notification from './common/Notification';
import { MdOutlineLogout } from "react-icons/md";

const NavBar = () => {
    // Access the current user details from the Redux store
    const user = useSelector((state) => state.user.user);
    // Access unread notifications count from Reduc store
    const unreadCount = useSelector((state) => state.notifications.unreadCount);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Access the current sidebar (small screen) state from the Redux store
    const smallSidebar = useSelector((state) => state.sidebar);

    // State to manage open/close logout dropdown
    const [openLogout, setOpenLogout] = useState(false);
    // State for open/close notification
    const [openNotification, setOpenNotification] = useState(false);

    // Handle close notification
    const handleCloseNotification = () => {
        setOpenNotification(prev => !prev);
    }

    // Toggle function for open/close logout dropdown
    const toggleLogoutSection = () => {
        setOpenLogout(!openLogout);
    }

    // Fuction to handle logout
    const handleLogout = async () => {
        try {
            const response = await makeRequest.post('/logout');
            if (response.data.success) {
                toast.success(response.data.message);
                // Dispatch the logout function
                dispatch(logout());
                navigate('/');
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='h-14 p-4 bg-white'>
            {/* Navbar for smaller devices */}
            <div className='md:hidden flex justify-between items-center'>
                <div onClick={() => dispatch(setOpenSideBar(!smallSidebar))} className='text-xl text-bb-theme-950 cursor-pointer'>
                    <IoReorderThreeSharp />
                </div>
                <div onClick={() => navigate('/')}>
                    <h1 className='font-bold text-bb-theme-500'>Bike<span className='text-bb-theme-800'>Buddy</span></h1>
                </div>
                {/* Logout and notification icons for smaller devices */}
                <div className='flex items-center'>
                    <div
                        onClick={() => setOpenNotification(!openNotification)}
                        className='relative cursor-pointer text-xl text-bb-theme-950'>
                        <IoNotificationsOutline />
                        {unreadCount > 0 && <div className='bg-red-600 h-4 w-4 rounded-md absolute -right-2 -top-1.5 text-xs text-center text-white'>{unreadCount}</div>}
                    </div>
                    <div onClick={handleLogout} className='text-lg cursor-pointer text-red-600 px-2 py-1 rounded-sm active:bg-gray-200'>
                        <MdOutlineLogout />
                    </div>
                </div>
            </div>

            {/* Desktop navbar */}
            <div className='hidden md:flex justify-between'>
                <div>
                    <h1 className='font-bold tracking-tighter text-bb-theme-950'>Hi, <span>{user.name}</span></h1>
                </div>
                {/* Notification icons and user profile section */}
                <div className='flex gap-4 items-center'>
                    {/* <div className='relative cursor-pointer text-xl'>
                        <IoMailOutline />
                        <div className='bg-red-600 h-4 w-4 rounded-md absolute -right-2 -top-1.5 text-xs text-center text-white'>4</div>
                    </div> */}
                    <div
                        onClick={() => setOpenNotification(!openNotification)}
                        className='relative cursor-pointer text-xl text-bb-theme-950'>
                        <IoNotificationsOutline />
                        {unreadCount > 0 && <div className='bg-red-600 h-4 w-4 rounded-md absolute -right-2 -top-1.5 text-xs text-center text-white'>{unreadCount}</div>}
                    </div>
                    {/* User profile section with dropdown */}
                    <div onClick={toggleLogoutSection} className='cursor-pointer flex gap-2 items-center text-sm text-bb-theme-950 tracking-tighter relative'>
                        <img className='h-7 w-7 rounded-full object-cover'
                            src={user.profilePicture
                                ? `${import.meta.env.VITE_BACKEND_URL}/images/${user.profilePicture}`
                                : profilePlaceholder} alt="" />
                        {user.name}
                        {/* Dropdown menu for profile and logout */}
                        <div className={`${!openLogout ? 'hidden' : ''} flex flex-col absolute -bottom-24 -right-2 gap-1 shadow-custom bg-white p-2 w-32 rounded-md z-50`}>
                            <span onClick={() => navigate('profile-page')} className='hover:bg-bb-theme-100 active:bg-bb-theme-200 border-l-4 border-white duration-300 hover:border-bb-theme-500 p-2 rounded-md'>My profile</span>
                            <span onClick={handleLogout} className='hover:bg-bb-theme-100 active:bg-bb-theme-200 border-l-4 border-white duration-300 hover:border-bb-theme-500 p-2 rounded-md text-red-500'>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Notification */}
            {openNotification && <Notification close={handleCloseNotification} />}
        </div>
    )
}

export default NavBar;