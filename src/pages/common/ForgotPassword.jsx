import React, { useState } from 'react';
import Logo from '../../logo/Logo';

const ForgotPassword = () => {

    return (
        <div className='bg-primaryColor h-screen w-full flex flex-col pt-8 xs:pt-16'>
            <div className='flex flex-col gap-5 justify-center items-center'>
                <div className='flex flex-col items-center gap-2'>
                    <Logo width={"145"} height={"77"} />
                    <h1 className='text-white font-semibold text-3xl'>Bike<span className='text-black'>Buddy</span></h1>
                </div>
                <div className='bg-white flex flex-col py-8 px-10 rounded-2xl w-[350px] xs:w-[400px] shadow-lg'>
                    <h1 className='text-xl font-semibold pb-5 text-center'>Find your account</h1>
                    <form action="" className='flex flex-col gap-5'>
                        <div>
                            <input type="text"
                                placeholder='Enter your email'
                                className='border focus:border-gray-500 w-full outline-none p-2 text-sm rounded-md' />
                        </div>
                        <button className='bg-primaryColor text-white py-1.5 rounded-md'>Forgot Password</button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;