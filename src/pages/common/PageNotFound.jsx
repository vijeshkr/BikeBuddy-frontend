import React from 'react';
import PageNotFoundImg from '../../assets/404.png'
import { useNavigate } from 'react-router-dom';

/**
 * PageNotFound Component
 * Display 404 page not found message
 * Provide an option to navigate the home page
 * 
 */

const PageNotFound = () => {

  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className=' h-screen w-full flex justify-center items-center'>
      <div className='flex flex-col items-center gap-2'>
        <img className='object-cover w-80 h-80 xs:w-96 xs:h-96' src={PageNotFoundImg} alt="" />
        <h1 className='text-xl sm:text-2xl text-primaryColor font-semibold'>Page Not Found</h1>
        <p>The page you are looking for is not available!</p>
        <button onClick={handleGoToHome} className='bg-primaryColor text-white px-3 py-2 rounded-md' >Go to Home</button>
      </div>
    </div>
  )
}

export default PageNotFound;