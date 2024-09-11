import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../../common/axios';

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
        <div className='container mx-auto h-96 flex justify-center items-center'>
            <div className='bg-green-200 p-5'>
                <h1 className='text-center text-2xl my-5'>Payment Successful</h1>
                <p className='text-center'>Thank you for your purchase!</p>
            </div>
        </div>
    )
}

export default SuccessPage;