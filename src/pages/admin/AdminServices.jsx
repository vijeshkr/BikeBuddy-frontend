import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';

const AdminServices = () => {
  return (
    <div>
      <div className='flex gap-2 text-sm'>
        <NavLink to='' end className={({ isActive }) => `${isActive ? 'child-nav' : 'px-2 py-1 rounded-md border border-primaryColor hover:bg-primaryColor hover:text-white active:opacity-90'}`}><button className=''>Package Services</button></NavLink>
        <NavLink to='individual-works' className={({ isActive }) => `${isActive ? 'child-nav' : 'px-2 py-1 rounded-md border border-primaryColor hover:bg-primaryColor hover:text-white active:opacity-90'}`}><button className=''>Individual Works</button></NavLink>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminServices;