import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';

const AdminMechanicList = () => {
  return (
    <div>
      <div className='flex gap-2 text-xs'>
        <NavLink to='' end className={({ isActive }) => `${isActive ? 'child-nav' : 'p-2 rounded-sm border border-primaryColor hover:bg-primaryColor hover:text-white active:opacity-90'}`}><button className=''>Mechanics</button></NavLink>
        <NavLink to='leave-requests' className={({ isActive }) => `${isActive ? 'child-nav' : 'p-2 rounded-sm border border-primaryColor hover:bg-primaryColor hover:text-white active:opacity-90'}`}><button className=''>Leaves</button></NavLink>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminMechanicList;