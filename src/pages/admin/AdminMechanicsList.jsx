import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';

const AdminMechanicList = () => {
  return (
    <div>
      <div className='flex gap-2 text-sm'>
        <NavLink to='' end className={({ isActive }) => `${isActive ? 'child-nav' : 'px-2 py-1 rounded-md border border-primaryColor hover:bg-primaryColor hover:text-white active:opacity-90'}`}><button className=''>Mechanics</button></NavLink>
        <NavLink to='leave-requests' className={({ isActive }) => `${isActive ? 'child-nav' : 'px-2 py-1 rounded-md border border-primaryColor hover:bg-primaryColor hover:text-white active:opacity-90'}`}><button className=''>Leaves</button></NavLink>
        <NavLink to='targets' className={({ isActive }) => `${isActive ? 'child-nav' : 'px-2 py-1 rounded-md border border-primaryColor hover:bg-primaryColor hover:text-white active:opacity-90'}`}><button className=''>Targets</button></NavLink>
        <NavLink to='salary' className={({ isActive }) => `${isActive ? 'child-nav' : 'px-2 py-1 rounded-md border border-primaryColor hover:bg-primaryColor hover:text-white active:opacity-90'}`}><button className=''>Salary</button></NavLink>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminMechanicList;