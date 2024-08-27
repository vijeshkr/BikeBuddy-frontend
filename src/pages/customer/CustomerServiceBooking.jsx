import React from 'react'
import BookService from '../../components/customer/BookService,';

const CustomerServiceBooking = () => {
  // Dummy data

  const bookings = [
    {
      id: 1,
      serviceDate: '2023-08-21',
      serviceType: 'Package',
      status: 'Pending',
      mechanic: 'John Doe',
      extraWorkRequested: 'Brake Check',
      extraWorkApproved: true,
      totalCost: '$150',
    },
    {
      id: 2,
      serviceDate: '2023-08-22',
      serviceType: 'Individual',
      status: 'In Progress',
      mechanic: 'Jane Smith',
      extraWorkRequested: 'Oil Change',
      extraWorkApproved: false,
      totalCost: '$50',
    },
    {
      id: 3,
      serviceDate: '2023-08-23',
      serviceType: 'Package',
      status: 'Completed',
      mechanic: 'Mike Johnson',
      extraWorkRequested: 'Tire Rotation',
      extraWorkApproved: true,
      totalCost: '$200',
    },
  ];


  return (
    <div>
      {/* Button */}
      <div className='flex gap-2 justify-end'>
        <button className='bg-purple-200 hover:bg-purple-300 active:bg-purple-200 py-1 px-2 rounded-md text-primaryColor'>Our Packages</button>
        <button className='bg-purple-200 hover:bg-purple-300 active:bg-purple-200 py-1 px-2 rounded-md text-primaryColor'>Service Charges</button>
        <button className='bg-purple-200 hover:bg-purple-300 active:bg-purple-200 py-1 px-2 rounded-md text-primaryColor'>Book a Breakdown</button>
      </div>

      <div className='flex flex-wrap gap-2'>
        {/* Service booking form */}
        <div className='min-w-[320px]'>
          <BookService />
        </div>

        {/* Next service and last service */}
        <div>
          <div>
            <h1 className='text-2xl font-semibold mb-4'>Current booking status</h1>
            <div className="overflow-x-auto">
              <table className="bg-white border rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 text-sm uppercase font-semibold">
                    <th className="py-3 px-4 text-left">Service Date</th>
                    <th className="py-3 px-4 text-left">Service Type</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Mechanic</th>
                    <th className="py-3 px-4 text-left">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-100">
                      <td className="py-3 px-4">{booking.serviceDate}</td>
                      <td className="py-3 px-4">{booking.serviceType}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${booking.status === 'Completed'
                              ? 'bg-green-200 text-green-800'
                              : booking.status === 'In Progress'
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-red-200 text-red-800'
                            }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{booking.mechanic}</td>
                      <td className="py-3 px-4">{booking.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className='bg-blue-200 flex'>
            <div>Next Service</div>
            <div>Last Service</div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default CustomerServiceBooking;