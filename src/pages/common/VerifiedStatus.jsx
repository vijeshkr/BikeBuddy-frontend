import React, { useEffect, useState } from 'react';
import Logo from '../../logo/Logo';
import verfiedImg from '../../assets/Verified-pana.png';
import failedImg from '../../assets/Bad idea-rafiki.png';
import { Link, useParams } from 'react-router-dom';
import makeRequest from '../../common/axios';

const VerifiedStatus = () => {

    // State to manage loading
    const [loading, setLoading] = useState(false);
    // State to store api respnse
    const [data, setData] = useState({ success: false });
    // Get the verification token from the url params
    const { token } = useParams();

    // Hook to run verification logic on component mount
    useEffect(() => {
        setLoading(true);
        // Send a request to the backend to verify the email using token
        const verifyEmail = async () => {
            try {
                const response = await makeRequest.get(`/verify-email/${token}`);
                setData(response.data);
            } catch (error) {
                console.error('Error verifying email: ', error);
            } finally {
                setLoading(false);
            }
        }

        verifyEmail();
    }, [token]);
    return (
        <div className='bg-bb-theme-900 h-screen w-full flex flex-col pt-8 xs:pt-16'>
            <div className='flex flex-col gap-5 justify-center items-center'>
                <div className='flex flex-col items-center gap-2'>
                    <Logo width={"145"} height={"77"} />
                    <h1 className='text-white font-semibold text-3xl'>Bike<span className='text-black'>Buddy</span></h1>
                </div>
                <div className='bg-white flex flex-col py-8 px-10 rounded-2xl w-[350px] xs:w-[400px] shadow-lg'>
                    <h1 className='text-xl font-semibold pb-5 text-center'>{data.success ? 'You have successfully verified your account' : 'Invalid or expired verification token!'}</h1>
                    <div>
                        {data &&
                            (
                                <img className='object-cover' src={data.success ? verfiedImg : failedImg} alt="" />

                            )
                        }
                    </div>
                    {
                        data.success ?
                            <Link to={'/login'}><button className='bg-bb-theme-900 text-white py-1.5 rounded-md w-full'>Back to Login</button></Link>
                            :
                            <Link to={'/register'}><button className='bg-bb-theme-900 text-white py-1.5 rounded-md w-full'>Back to Signup</button></Link>
                    }
                </div>
            </div>
        </div>
    )
}

export default VerifiedStatus;