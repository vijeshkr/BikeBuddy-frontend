import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import ImageView from '../../components/common/ImageView';
import { useLocation, useNavigate } from 'react-router-dom';
import makeRequest from '../../common/axios';
import LoadingIndicatior from '../../components/LoadingIndicator';
import socket from '../../common/socket';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MechanicFilteredSpare = () => {

  const location = useLocation();
  const navigate = useNavigate();

  // Get filter parameter from URL query
  const query = new URLSearchParams(location.search);
  const filterSuitable = query.get('filter') || '';


  // State to manage spare parts data
  const [spareParts, setSpareParts] = useState([]);
  // State to manage loading
  const [loading, setLoading] = useState(false);
  // State to manage image viewer open close
  const [openImg, setOpenImg] = useState(false);
  const [currentImg, setCurrentImg] = useState('');
  // State to manage search
  const [searchTerm, setSearchTerm] = useState('');

  // Function for fetch all spare parts details from the api
  const fetchSpare = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get('/get-all-spare');
      if (response.data.success) {
        setSpareParts(response.data.data);
      }
    } catch (error) {
      console.error('Error while fetching spare parts: ', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSpare();
  }, []);

  // Handle search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  // Handle open image viewer
  const handleOpenImgViewer = (img) => {
    setOpenImg(!openImg);
    setCurrentImg(img);
  }

  // Handle close image viewer
  const handleCloseImgViewer = () => {
    setOpenImg(prev => !prev);
  }

  const handleFilterSpare = () => {
    // Navigate with query parameters
    // const query = new URLSearchParams({ filter: filterSuitable }).toString();
    if (filterSuitable !== '') {
      const query = '';
      navigate(`/mechanic/mechanic-spare-parts/filtered-spare?${query}`);
    } else {
      navigate(`/mechanic/mechanic-spare-parts`);
    }
  }


  // Filter spare parts based on the URL parameter
  const filteredSpare = spareParts
    .filter(item => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => item.suitable._id === filterSuitable || filterSuitable === '');


  // Socket io
  useEffect(() => {

    socket.on('newSpare', (newSpare) => {
      setSpareParts((prev) =>
        [
          ...prev,
          newSpare
        ]
      );
    });

    // Clean up socket event listener
    return () => {
      socket.off('newSpare');
    }
  });

  useEffect(() => {

    socket.on('updatedSpare', (updatedSpare) => {
      setSpareParts((prev) => {
        // Map over the previous state
        return prev.map((spare) =>
          // Replace the item if IDs match
          spare._id === updatedSpare._id ? updatedSpare : spare
        );
      });

    });

    // Clean up socket event listener
    return () => {
      socket.off('updatedSpare');
    }
  });

  useEffect(() => {

    socket.on('deletedSpare', (deletedSpare) => {
      setSpareParts((prev) => {
        // Filter out the item with the matching ID
        return prev.filter((spare) => spare._id !== deletedSpare);
      });


    });

    // Clean up socket event listener
    return () => {
      socket.off('deletedSpare');
    }
  });

  return (
    <div>
      {loading && <LoadingIndicatior />}
      <div className='py-2 flex justify-between flex-wrap gap-2'>
        {/* Search input field */}
        {filteredSpare.length !== 0 &&
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
          </div>}
        {/* Filter button */}
        <div>
          <button
            onClick={handleFilterSpare}
            className='bg-primaryColor text-white text-sm xs:text-base py-1 px-2 rounded-md'>
            {filterSuitable !== '' ? 'All Spares' : 'Filter'}
          </button>
        </div>
      </div>

      {/* Display spare parts in table for large screens */}
      {filteredSpare.length === 0 ? 'No spare parts available' :
        <div className='xl:overflow-y-auto xl:scrollbar-none xl:max-h-[505px] xl:border-b'>
          <table className='hidden sm:table w-full shadow-custom min-w-[455px]'>
            <thead>
              <tr className='bg-primaryColor text-white text-sm text-left'>
                <th className='font-normal px-2'>Image</th>
                <th className='font-normal px-2'>Name</th>
                <th className='font-normal px-2'>Suitable</th>
                <th className='font-normal px-2'>Stocks</th>
                <th className='font-normal px-2 min-w-16'>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpare.length === 0 ? <div className='p-5'>No spare parts available</div> :
                filteredSpare.map((spare, index) => (
                  <tr key={index} className='border text-sm text-start'>
                    <td className='p-2'><img
                      onClick={() => handleOpenImgViewer(spare.image)}
                      className='h-20 w-32 object-contain rounded-md cursor-pointer' src={`${backendUrl}/images/${spare.image}`} alt="" /></td>
                    <td className='p-2'>{spare.itemName}</td>
                    <td className='p-2'>{spare.suitable.name}</td>
                    <td className='p-2'>{spare.stock === 0 ? <p className='text-red-500'>Out of stock</p> : spare.stock}</td>
                    <td className='p-2'><span>&#8377; </span>{spare.price}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      }

      {/* Small screen devices */}
      <div className='sm:hidden'>
        {
          filteredSpare.map((spare, index) => (
            <div key={index} className='min-w-[320px] text-sm flex flex-col gap-3 p-2 shadow-custom'>
              <div
                className='cursor-pointer'
                onClick={() => handleOpenImgViewer(spare.image)}>
                <img
                  className='w-full h-32 object-contain'
                  src={`${backendUrl}/images/${spare.image}`} alt="" />
              </div>
              <h1 className='font-semibold'>{spare.itemName}</h1>
              <h3 className='text-gray-500'>Suitable for {spare.suitable.name}</h3>
              <p>{spare.stock === 0 ? <p className='text-red-500'>Out of stock</p> : `Stock : ${spare.stock}`}</p>
              <div className='flex justify-between'>
                <h3 className='font-medium'>Price : <span>&#8377; </span>{spare.price}</h3>
              </div>
            </div>
          ))
        }
      </div>

      {/* Image viewer */}
      {openImg && <ImageView close={handleCloseImgViewer} imgUrl={currentImg} />}
    </div>
  )
}

export default MechanicFilteredSpare;