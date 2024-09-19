import React, { useState } from 'react'
import BookService from '../../components/customer/BookService,';
import CurrentBookings from '../../components/customer/CurrentBookings';
import PackageServicesList from '../../components/customer/PackageServicesList';
import ServiceChargesList from '../../components/customer/ServiceChargesList';
import BreakdownBookingPopup from '../../components/customer/BreakdownBookingPopup';

const CustomerServiceBooking = () => {
  // State to manage open/close packages and service charges
  const [openPackage, setOpenPackage] = useState(false);
  const [openServiceCharges, setOpenServiceCharges] = useState(false);
  const [openBreakdownPopup, setOpenBreakdownPopup] = useState(false);

  // Handle open packages
  const handleOpenPackage = () => {
    setOpenPackage(!openPackage);
  }

  // Handle open service charges
  const handleOpenServiceCharges = () => {
    setOpenServiceCharges(!openPackage);
  }

  // Handle open breakdown
  const handleOpenBreakdown = () => {
    setOpenBreakdownPopup(!openBreakdownPopup);
  }

  // Handle close function for package popup
  const handleClosePackage = () => {
    setOpenPackage(prev => !prev);
  }

  // Handle close function for service charges popup
  const handleCloseServiceCharges = () => {
    setOpenServiceCharges(prev => !prev);
  }

  // Handle close function for service charges popup
  const handleCloseBreakdown = () => {
    setOpenBreakdownPopup(prev => !prev);
  }

  return (
    <div>
      {/* Button */}
      <div className='flex gap-2 sm:justify-end justify-center mb-4'>
        <button 
        onClick={handleOpenPackage}
        className='text-xs sm:text-sm bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 text-white px-2 py-1 rounded-lg shadow-md'>Our Packages</button>
        <button
        onClick={handleOpenServiceCharges} 
        className='text-xs sm:text-sm bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 text-white px-2 py-1 rounded-lg shadow-md'>Service Charges</button>
        <button 
                onClick={handleOpenBreakdown}
        className='text-xs sm:text-sm bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 text-white px-2 py-1 rounded-lg shadow-md'>Book a Breakdown</button>
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
      { openBreakdownPopup && <BreakdownBookingPopup close={handleCloseBreakdown} /> }

    </div>
  )
}

export default CustomerServiceBooking;