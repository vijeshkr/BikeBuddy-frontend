import React, { useState } from 'react'
import BookService from '../../components/customer/BookService,';
import CurrentBookings from '../../components/customer/CurrentBookings';
import PackageServicesList from '../../components/customer/PackageServicesList';
import ServiceChargesList from '../../components/customer/ServiceChargesList';

const CustomerServiceBooking = () => {
  // State to manage open/close packages and service charges
  const [openPackage, setOpenPackage] = useState(false);
  const [openServiceCharges, setOpenServiceCharges] = useState(false);

  // Handle open packages
  const handleOpenPackage = () => {
    setOpenPackage(!openPackage);
  }

  // Handle open service charges
  const handleOpenServiceCharges = () => {
    setOpenServiceCharges(!openPackage);
  }

  // Handle close function for package popup
  const handleClosePackage = () => {
    setOpenPackage(prev => !prev);
  }

  // Handle close function for service charges popup
  const handleCloseServiceCharges = () => {
    setOpenServiceCharges(prev => !prev);
  }

  return (
    <div>
      {/* Button */}
      <div className='flex gap-2 sm:justify-end justify-center mb-4'>
        <button 
        onClick={handleOpenPackage}
        className='text-xs sm:text-base bg-purple-200 hover:bg-purple-300 active:bg-purple-200 py-1 px-2 rounded-md text-primaryColor'>Our Packages</button>
        <button
        onClick={handleCloseServiceCharges} 
        className='text-xs sm:text-base bg-purple-200 hover:bg-purple-300 active:bg-purple-200 py-1 px-2 rounded-md text-primaryColor'>Service Charges</button>
        <button className='text-xs sm:text-base bg-purple-200 hover:bg-purple-300 active:bg-purple-200 py-1 px-2 rounded-md text-primaryColor'>Book a Breakdown</button>
      </div>

      <div className='flex flex-wrap gap-2 justify-center'>
        {/* Service booking form */}
        <div className='min-w-[320px]'>
          <BookService />
        </div>

        {/* Next service and last service */}
        <div className='flex-1'>
          <div>
            <CurrentBookings/>
          </div>

        </div>
      </div>
      { openPackage && <PackageServicesList close={handleClosePackage} /> }
      { openServiceCharges && <ServiceChargesList close={handleCloseServiceCharges} /> }

    </div>
  )
}

export default CustomerServiceBooking;