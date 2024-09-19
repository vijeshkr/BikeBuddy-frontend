import React, { useEffect, useState } from 'react';
import CreateNewUser from '../../components/admin/CreateNewUser';
import makeRequest from '../../common/axios';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerDetails } from '../../redux/features/customersSlice';
import { IoSearch } from "react-icons/io5";
import Pagination from '../../components/common/Pagination';

const AdminCustomersList = () => {
  // State to manage loading
  const [loading, setLoading] = useState(false);
  // State to manage search
  const [searchTerm, setSearchTerm] = useState('');
  // State to manage current page
  const [currentPage, setCurrentPage] = useState(1);
  // State to manage customers per page
  const [customersPerPage] = useState(9);


  // Access customer data from the Redux store
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
        // Update the Redux store with fetched data
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

  // Pagination logic for table
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredData.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(filteredData.length / customersPerPage);

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      {loading && <LoadingIndicator />}
      <div className='flex gap-4 flex-wrap'>
        <div className='min-w-[340px] lg:min-w-[700px] p-4 rounded-lg bg-white'>
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
          {currentCustomers.length > 0 ? (
            <div>
              <div className='hidden lg:block'>
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-bb-theme-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Email</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Phone</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Place</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentCustomers.map((customer) => (
                      <tr key={customer._id} className='hover:bg-bb-theme-50 even:bg-gray-50'>
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

                {/* Pagination component */}
                <div className='p-4 hidden lg:block'>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>

              {/* Customer data in card for small screens */}
              <div className="lg:hidden flex flex-wrap gap-4">
                {filteredData.map((customer) => (
                  <div key={customer._id} className="bg-white border rounded-lg p-4 mb-4 w-full md:w-[300px] min-w-[300px]">
                    <h3 className="text-lg font-semibold mb-2">{customer.name}</h3>
                    <p className="mb-1"><strong>Email:</strong> {customer.email}</p>
                    <p className="mb-1"><strong>Phone:</strong> {customer.phone ? customer.phone : <span className="text-red-500">N/A</span>}</p>
                    <p className="mb-1"><strong>Place:</strong> {customer.place ? customer.place : <span className="text-red-500">N/A</span>}</p>
                  </div>
                ))}
              </div>

            </div>

          ) :
            <div className='py-3 px-6'>No data available</div>
          }
        </div>
        <div className='min-w-[340px] lg:min-w-[400px]'>
          <CreateNewUser role={'customer'} />
        </div>
      </div>

    </div>
  )
}

export default AdminCustomersList;