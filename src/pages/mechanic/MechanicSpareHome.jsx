import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MechanicSpareHome = () => {
  // State to manage all vehicles
  const [allVehicles, setAllVehicles] = useState([]);
  // State to manage loading
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Function for fetch vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get('/get-all-vehicles');
      if (response.data.success) {
        setAllVehicles(response.data.data);
      }
    } catch (error) {
      console.error('Error while fetching vehicles: ', error);
    } finally {
      setLoading(false);
    }
  }


  // Filter spare
  const handleFilterSpare = (filterSuitable) => {
    // Navigate with query parameters
    const query = new URLSearchParams({ filter: filterSuitable }).toString();
    navigate(`filtered-spare?${query}`);
  }


  useEffect(() => {
    fetchVehicles();
  }, []);
  return (
    <div className='p-1 flex flex-col gap-3'>
      {loading && <LoadingIndicator />}
      <div className='flex justify-end'>
        <button
          onClick={() => handleFilterSpare('')}
          className='bg-primaryColor px-2 py-1 text-white rounded-md text-sm xs:text-base'>All Spares</button>
      </div>
      <div className='flex flex-wrap gap-4 justify-center'>
        {
          allVehicles.map((vehicle, index) => (
            <div
              onClick={() => handleFilterSpare(vehicle._id)}
              className='flex flex-col justify-center items-center shadow-custom gap-2 cursor-pointer p-2'
              key={index}>
              <img
                className='w-80 h-60 object-contain'
                src={`${backendUrl}/images/${vehicle.image}`} alt="" />
              <p className='text-lg font-semibold'>{vehicle.name}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MechanicSpareHome;