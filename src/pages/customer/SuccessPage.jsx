import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../../common/axios';
import paymentSuccess from '../../assets/Banknote-pana.png';

const SuccessPage = () => {
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get('session_id');

        if (sessionId) {
            try {
                // Call server to handle successful payment
                const response = await makeRequest.post('/payment-success', { sessionId });

                setTimeout(() => {
                    navigate('/');
                }, 5000);

            } catch (error) {
                console.error('Error verifying payment:', error);

            }
        } else {
            console.error('Session id not found');
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []);
    return (
        <div className='h-full bg-white rounded-lg shadow-custom flex justify-center items-center'>
            <div className='p-5 rounded-lg'>
                <h1 className='text-center text-2xl my-5 font-bold bg-clip-text text-transparent bg-gradient-to-b from-green-500 to-green-700'>Payment Successful</h1>
                <p className='text-center text-green-700'>Thank you for choosing our service!</p>
                <button
                onClick={() => navigate('/')} 
                className='bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white px-2 py-1.5 rounded-lg my-3 w-full'>Go to Home</button>
            </div>
            <div>
                <img src={paymentSuccess} alt='Payment Success' 
                className='h-96 p-5' />
            </div>
        </div>
    )
}

export default SuccessPage;