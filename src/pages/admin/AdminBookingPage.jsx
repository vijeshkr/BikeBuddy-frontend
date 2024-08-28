import React from 'react'
import DataCard from '../../components/admin/DataCard';
import AllBookings from '../../components/admin/AllBookings';

const AdminBookingPage = () => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex gap-4 justify-between flex-wrap'>
        <DataCard status={'All'}/>
        <DataCard status={'Unallocated'}/>
        <DataCard status={'Pending'}/>
        <DataCard status={'Completed'}/>
      </div>
      <div>
        <AllBookings/>
      </div>
    </div>
  )
}

export default AdminBookingPage;