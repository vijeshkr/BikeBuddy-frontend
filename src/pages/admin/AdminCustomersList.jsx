import React, { useEffect, useState } from 'react';
import CreateNewUser from '../../components/admin/CreateCustomer';
import makeRequest from '../../common/axios';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerDetails } from '../../redux/features/customersSlice';
import { IoSearch } from "react-icons/io5";

const AdminCustomersList = () => {
  // State to manage loading
  const [loading, setLoading] = useState(false);
  // State to manage search
  const [searchTerm, setSearchTerm] = useState('');

  const customers = useSelector((state) => state.customer.customer);

  const dispatch = useDispatch();

  const role = 'customer';

  // Handle search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  // Function for fetch customer data
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get(`/get-users/${role}`);
      if (response.data.success) {
        dispatch(setCustomerDetails({ customer: response.data.data }));
      }
    } catch (error) {
      console.error('Error while fetching customer details: ', error);
    } finally {
      setLoading(false);
    }
  }

  // Search data
  const filteredData = customers.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      item.phone?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    fetchCustomers();
  }, [])
  return (
    <div className='flex gap-4 flex-wrap'>
      {loading && <LoadingIndicator />}
      <div className='min-w-[340px] lg:min-w-[700px] p-4 rounded-md'>
        {customers.length !== 0 &&
          <div className='mb-3'>
            <div className='border rounded-md px-2 flex items-center justify-between max-w-[250px]'>
              <input
                onChange={handleSearch}
                value={searchTerm}
                className='outline-none p-1 text-sm'
                type="text"
                placeholder='Search' />
              <div className='px-2 text-gray-400'>
                <IoSearch />
              </div>
            </div>
          </div>
        }

        {/* Showing users data in a table */}
        {filteredData.length > 0 ? (
          <div>
            <div className='lg:overflow-y-auto lg:scrollbar-none xl:h-[510px] hidden lg:flex'>
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((customer) => (
                    <tr key={customer._id}>
                      <td className="px-4 py-3 whitespace-nowrap">{customer.name}</td>
                      <td className="px-4 py-3">{customer.email}</td>
                      <td className="px-4 py-3">{customer.phone ? customer.phone :
                        <span className="text-red-500">N/A</span>}</td>
                      <td className="px-4 py-3">{customer.place ? customer.place :
                        <span className="text-red-500">N/A</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Small screens */}

            <div className="lg:hidden flex flex-wrap gap-4">
              {filteredData.map((customer) => (
                <div key={customer._id} className="bg-white shadow-custom rounded-lg p-4 mb-4 w-full md:w-[300px] min-w-[300px]">
                  <h3 className="text-lg font-semibold mb-2">{customer.name}</h3>
                  <p className="text-gray-700 mb-1"><strong>Email:</strong> {customer.email}</p>
                  <p className="text-gray-700 mb-1"><strong>Phone:</strong> {customer.phone ? customer.phone : <span className="text-red-500">N/A</span>}</p>
                  <p className="text-gray-700 mb-1"><strong>Place:</strong> {customer.place ? customer.place : <span className="text-red-500">N/A</span>}</p>
                </div>
              ))}
            </div>

          </div>

        ) :
          <div className='py-3 px-6'>No data available</div>
        }
      </div>
      <div className='min-w-[340px] lg:min-w-[400px] p-4 rounded-md'>
        <CreateNewUser role={'customer'} />
      </div>
    </div>
  )
}

export default AdminCustomersList;