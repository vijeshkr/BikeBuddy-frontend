import React, { useState } from 'react';
import Logo from '../../logo/Logo';
import makeRequest from '../../common/axios';
import newMail from '../../assets/New message-pana.png'
import { validateEmail } from '../../common/validations';
import LoadingIndicator from '../../components/LoadingIndicator';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [userFound,setUserFound] = useState(false);

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        const errors = validateEmail(newEmail) ? '' : 'Invalid email address';
        setEmailError(errors);
    }

    // State to manage loading
    const [loading, setLoading] = useState(false);
    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setGeneralError('');

        // Check for empty fields
        if (!email) {
            setGeneralError('Enter your email');
        } else {
            // Check if there are no errors
            if (!emailError) {
                // Send data to the server
                setLoading(true);
                try {
                    // Forgot password api call
                    const response = await makeRequest.post('/forgot-password', {email});
                    setUserFound(response.data.success);
                } catch (error) {
                    console.error('Error during forgot password : ', error);
                    toast.error(error?.response?.data?.message);

                } finally {
                    setLoading(false);
                }
            }
        }
    };
    return (
        <div className='bg-primaryColor h-screen w-full flex flex-col pt-8 xs:pt-16'>
            {/* Showing loading indicator during api call */}
            {loading && <LoadingIndicator />}
            <div className='flex flex-col gap-5 justify-center items-center'>
                <div className='flex flex-col items-center gap-2'>
                    <Logo width={"145"} height={"77"} />
                    <h1 className='text-white font-semibold text-3xl'>Bike<span className='text-black'>Buddy</span></h1>
                </div>
                {!userFound ?
                    <div className='bg-white flex flex-col py-8 px-10 rounded-2xl w-[350px] xs:w-[400px] shadow-lg'>
                        <h1 className='text-xl font-semibold pb-5 text-center'>Find your account</h1>
                        <form onSubmit={handleSubmit} action="" className='flex flex-col gap-5'>
                            <div>
                                <input type="text"
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => handleEmailChange(e)}
                                    className={`border w-full outline-none p-2 text-sm rounded-md ${emailError ? 'border-red-500' : `${email && !emailError ? 'border-green-500' : 'focus:border-gray-500'}`}`}
                                />
                            </div>
                            {/* Display email-specific error */}
                            {emailError && <p className='text-red-500 text-xs'>{emailError}</p>}
                            {/* Display general error if any */}
                            {generalError && <p className='text-red-500 text-xs'>{generalError}</p>}
                            <button className='bg-primaryColor text-white py-1.5 rounded-md'>Send Reset Link</button>

                        </form>
                    </div>
                    :
                    <div className='bg-white flex flex-col py-8 px-10 rounded-2xl w-[350px] xs:w-[400px] shadow-lg'>
                        <h1 className='text-xl font-semibold pb-5 text-center'>Check your email</h1>
                        <div className='flex justify-center'>
                            <img className='object-cover h-48' src={newMail} alt="" />
                        </div>
                        <p className='text-sm font-medium pb-5 text-center'>We have sent a password reset link to your email.</p>
                        <Link to={'/login'}><button className='bg-primaryColor text-white py-1.5 rounded-md w-full'>Back to Login</button></Link>

                    </div>
                }
            </div>
        </div>
    )
}

export default ForgotPassword;