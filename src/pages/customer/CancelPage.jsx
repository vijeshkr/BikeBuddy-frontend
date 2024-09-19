import React, { useEffect } from 'react';
import paymentSuccess from '../../assets/payment-failed.png'
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        setTimeout(() => {
            navigate('/');
        }, 5000);
    },[]);
    return (
        <div className='h-full bg-white rounded-lg shadow-custom flex justify-center items-center'>
            <div className='p-5 rounded-lg'>
                <h1 className='text-center text-2xl my-5 font-bold bg-clip-text text-transparent bg-gradient-to-b from-red-500 to-red-700'>Payment Failed</h1>
                <p className='text-center text-red-700'>Your payment was failed. Please try again.</p>
                <button
                    onClick={() => navigate('/')}
                    className='bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 text-white px-2 py-1.5 rounded-lg my-3 w-full'>Go to Home</button>
            </div>
            <div>
                <img src={paymentSuccess} alt='Payment Success'
                    className='h-96 p-5' />
            </div>
        </div>
    )
}

export default CancelPage;