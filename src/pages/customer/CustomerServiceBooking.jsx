import React from 'react'
import BookService from '../../components/customer/BookService,';
import CurrentBookings from '../../components/customer/CurrentBookings';

const CustomerServiceBooking = () => {

  return (
    <div>
      {/* Button */}
      <div className='flex gap-2 xs:justify-end justify-center mb-4'>
        <button className='text-xs xs:text-base bg-purple-200 hover:bg-purple-300 active:bg-purple-200 py-1 px-2 rounded-md text-primaryColor'>Our Packages</button>
        <button className='text-xs xs:text-base bg-purple-200 hover:bg-purple-300 active:bg-purple-200 py-1 px-2 rounded-md text-primaryColor'>Service Charges</button>
        <button className='text-xs xs:text-base bg-purple-200 hover:bg-purple-300 active:bg-purple-200 py-1 px-2 rounded-md text-primaryColor'>Book a Breakdown</button>
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

    </div>
  )
}

export default CustomerServiceBooking;