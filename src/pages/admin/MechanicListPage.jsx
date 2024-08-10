import React, { useEffect, useState } from 'react';
import CreateNewUser from '../../components/admin/CreateNewUser';
import makeRequest from '../../common/axios';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { setMechanicDetails } from '../../redux/features/mechanicSlice';
import { IoSearch } from "react-icons/io5";

const MechanicListPage = () => {
  // State to manage loading
  const [loading, setLoading] = useState(false);
  // State to manage search
  const [searchTerm, setSearchTerm] = useState('');

  const mechanics = useSelector((state) => state.mechanic.mechanic);

  const dispatch = useDispatch();

  const role = 'mechanic';

  // Handle search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  // Function for fetch mechanic data
  const fetchMechanics = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get(`/get-users/${role}`);
      if (response.data.success) {
        dispatch(setMechanicDetails({ mechanic: response.data.data }));
      }
    } catch (error) {
      console.error('Error while fetching mechanic details: ', error);
    } finally {
      setLoading(false);
    }
  }

  // Search data
  const filteredData = mechanics.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      item.phone?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    fetchMechanics();
  }, [])
  return (
    <div className='flex gap-4 flex-wrap'>
      {loading && <LoadingIndicator />}
      <div className='min-w-[340px] lg:min-w-[700px] p-4 rounded-md'>
        {mechanics.length !== 0 &&
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
            <div className='lg:overflow-y-auto lg:scrollbar-none xl:h-[510px] hidden lg:flex items-start'>
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
                  {filteredData.map((mechanic) => (
                    <tr key={mechanic._id}>
                      <td className="px-4 py-3 whitespace-nowrap">{mechanic.name}</td>
                      <td className="px-4 py-3">{mechanic.email}</td>
                      <td className="px-4 py-3">{mechanic.phone ? mechanic.phone :
                        <span className="text-red-500">N/A</span>}</td>
                      <td className="px-4 py-3">{mechanic.place ? mechanic.place :
                        <span className="text-red-500">N/A</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Small screens */}

            <div className="lg:hidden flex flex-wrap gap-4">
              {filteredData.map((mechanic) => (
                <div key={mechanic._id} className="bg-white shadow-custom rounded-lg p-4 mb-4 w-full md:w-[300px] min-w-[300px]">
                  <h3 className="text-lg font-semibold mb-2">{mechanic.name}</h3>
                  <p className="text-gray-700 mb-1"><strong>Email:</strong> {mechanic.email}</p>
                  <p className="text-gray-700 mb-1"><strong>Phone:</strong> {mechanic.phone ? mechanic.phone : <span className="text-red-500">N/A</span>}</p>
                  <p className="text-gray-700 mb-1"><strong>Place:</strong> {mechanic.place ? mechanic.place : <span className="text-red-500">N/A</span>}</p>
                </div>
              ))}
            </div>

          </div>

        ) :
          <div className='py-3 px-6'>No data available</div>
        }
      </div>
      <div className='min-w-[340px] lg:min-w-[400px] p-4 rounded-md'>
        <CreateNewUser role={'mechanic'} />
      </div>
    </div>
  )
}

export default MechanicListPage;