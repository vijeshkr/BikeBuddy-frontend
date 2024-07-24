import React, { useState } from 'react';
import Logo from '../../logo/Logo';
import verificationMailImg from '../../assets/New message-pana.png';
import { Link } from 'react-router-dom';

const VerificationMail = () => {

    return (
        <div className='bg-primaryColor h-screen w-full flex flex-col pt-8 xs:pt-16'>
            <div className='flex flex-col gap-5 justify-center items-center'>
                <div className='flex flex-col items-center gap-2'>
                    <Logo width={"145"} height={"77"} />
                    <h1 className='text-white font-semibold text-3xl'>Bike<span className='text-black'>Buddy</span></h1>
                </div>
                <div className='bg-white flex flex-col py-8 px-10 rounded-2xl w-[350px] xs:w-[400px] shadow-lg'>
                    <h1 className='text-xl font-semibold pb-5 text-center'>Verify your email</h1>
                    <div className='flex justify-center'>
                        <img className='object-cover h-48' src={verificationMailImg} alt="" />
                    </div>
                    <p className='text-sm font-medium pb-5 text-center'>We have sent a verification link to your email.</p>
                    <Link to={'/login'}><button className='bg-primaryColor text-white py-1.5 rounded-md w-full'>Back to Login</button></Link>

                </div>
            </div>
        </div>
    )
}

export default VerificationMail;