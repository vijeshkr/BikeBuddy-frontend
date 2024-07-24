import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Logo from '../../logo/Logo';
import { validatePassword } from '../../common/validations';

const ResetPassword = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showEyeIcon, setShowEyeIcon] = useState('hidden');

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showConfirmEyeIcon, setShowConfirmEyeIcon] = useState('hidden');

    // Eye icon toggle fuction for password visibility
    const handleMouseDown = (e) => {
        // Prevents losing focus on the input field
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    // Eye toggle funcion for confirm password
    const handleMouseDownConfirmPassword = (e) => {
        // Prevents losing focus on the input field
        e.preventDefault();
        setShowConfirmPassword(!showConfirmPassword);
    };

    // State hook for form fields 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // State hook for the errors
    const [passwordErrors, setPasswordErrors] = useState({});
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    // Password validation
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const errors = validatePassword(newPassword);
        setPasswordErrors(errors);
    }
    // Confirm password validation
    const handleConfirmPasswordChange = (e) => {
        const cPassword = e.target.value;
        setConfirmPassword(cPassword);
        const confirmPasswordError = password === cPassword ? '' : 'Passwords do not match';
        setConfirmPasswordError(confirmPasswordError);
    }

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous errors
        setGeneralError('');

        // Check for empty fields
        if (!password || !confirmPassword) {
            setGeneralError('Every field must be filled');
        } else {
            // Check if there are no errors
            if (Object.keys(passwordErrors).length === 0 && !confirmPasswordError) {
                // Send data to the server

            }
        }
    };


    return (
        <div className='bg-primaryColor h-screen w-full flex flex-col pt-8 xs:pt-16'>
            <div className='flex flex-col gap-5 justify-center items-center'>
                <div className='flex flex-col items-center gap-2'>
                    <Logo width={"145"} height={"77"} />
                    <h1 className='text-white font-semibold text-3xl'>Bike<span className='text-black'>Buddy</span></h1>
                </div>
                <div className='bg-white flex flex-col py-8 px-10 rounded-2xl w-[350px] xs:w-[400px] shadow-lg'>
                    <h1 className='text-xl font-semibold pb-5 text-center'>Create new password</h1>
                    <form onSubmit={handleSubmit} action="" className='flex flex-col gap-5'>
                        <div
                            className={`flex border  items-center text-sm rounded-md ${Object.keys(passwordErrors).length ? 'border-red-500' : `${password && Object.keys(passwordErrors).length === 0 ? 'border-green-500' : 'focus-within:border-gray-500'}`}`}>
                            <input type={showPassword ? 'text' : 'password'}
                                placeholder='Password'
                                onFocus={() => setShowEyeIcon('')}
                                onBlur={() => setShowEyeIcon('hidden')}
                                onChange={(e) => { handlePasswordChange(e) }}
                                className='w-full outline-none p-2 text-sm rounded-md' />
                            <div className={`p-2 cursor-pointer ${showEyeIcon}`} onMouseDown={handleMouseDown}>
                                <span className='text-gray-500'>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        {/* Display password-specific errors */}
                        {passwordErrors.length && <p className='text-red-500 text-xs'>{passwordErrors.length}</p>}
                        {passwordErrors.uppercase && <p className='text-red-500 text-xs'>{passwordErrors.uppercase}</p>}
                        {passwordErrors.lowercase && <p className='text-red-500 text-xs'>{passwordErrors.lowercase}</p>}
                        {passwordErrors.number && <p className='text-red-500 text-xs'>{passwordErrors.number}</p>}
                        {passwordErrors.special && <p className='text-red-500 text-xs'>{passwordErrors.special}</p>}
                        <div
                            className={`flex border ${confirmPasswordError ? 'border-red-500' : `${confirmPassword && !confirmPasswordError ? 'border-green-500' : 'focus-within:border-gray-500'}`} items-center text-sm rounded-md`}>
                            <input type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='Confirm Password'
                                onFocus={() => setShowConfirmEyeIcon('')}
                                onBlur={() => setShowConfirmEyeIcon('hidden')}
                                onChange={(e) => { handleConfirmPasswordChange(e) }}
                                className='w-full outline-none p-2 text-sm rounded-md' />
                            <div className={`p-2 cursor-pointer ${showConfirmEyeIcon}`} onMouseDown={handleMouseDownConfirmPassword}>
                                <span className='text-gray-500'>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        {confirmPasswordError && <p className='text-red-500 text-xs'>{confirmPasswordError}</p>}
                        {/* Display general error if any */}
                        {generalError && <p className='text-red-500 text-xs'>{generalError}</p>}
                        <button className='bg-primaryColor text-white py-1.5 rounded-md'>Reset Password</button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;