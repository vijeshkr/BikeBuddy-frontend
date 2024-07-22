import React from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Logo from '../logo/Logo';

const Login = () => {
    return (
        <div className='bg-primaryColor h-screen w-full flex flex-col pt-8 xs:pt-16'>
            <div className='flex flex-col gap-5 justify-center items-center'>
            <div className='flex flex-col items-center gap-2'>
                <Logo width={"145"} height={"77"}/>
                <h1 className='text-white font-semibold text-3xl'>Bike<span className='text-black'>Buddy</span></h1>
            </div>
            <div className='bg-white flex flex-col py-8 px-10 rounded-2xl w-[350px] xs:w-[400px] shadow-lg'>
                <h1 className='text-xl font-semibold pb-5 text-center'>Login to your account</h1>
                <form action="" className='flex flex-col gap-5'>
                    <div>
                        <input type="text"
                            placeholder='Email'
                            className='border focus:border-gray-500 w-full outline-none p-2 text-sm rounded-md' />
                    </div>
                    <div className='flex border focus-within:border-gray-500 items-center text-sm rounded-md'>
                        <input type="password"
                            placeholder='Password'
                            className='w-full outline-none p-2 text-sm rounded-md' />
                        <div className='p-2 cursor-pointer'>
                            <span className='text-gray-500'>
                                <FaEye />
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className='text-primaryColor text-end font-semibold text-sm'>Forgot Password ?</p>
                    </div>
                    <button className='bg-primaryColor text-white py-1.5 rounded-md'>Sign In</button>
                    <div className='text-sm pb-14'>
                        <p className='text-end font-semibold text-gray-500'>Don't have an account ? <span className='text-primaryColor'>Get Started</span></p>
                    </div>
                </form>
            </div>
            </div>
        </div>
    )
}

export default Login