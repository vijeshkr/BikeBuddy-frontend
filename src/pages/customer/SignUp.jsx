import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Logo from '../../logo/Logo';
import { validateName, validateEmail, validatePassword } from '../../common/validations';
import { Link, useNavigate } from 'react-router-dom';
import makeRequest from '../../common/axios';
import { toast } from 'react-toastify';
import LoadingIndicator from '../../components/LoadingIndicator';

const SignUp = () => {

    const navigate = useNavigate();

    // Password show and hide state
    const [showPassword, setShowPassword] = useState(false);
    const [showEyeIcon, setShowEyeIcon] = useState('hidden');
    // Confirm password show and hide state
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

    // State hooks for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // State hooke for the errors
    const [nameErrors, setNameErrors] = useState({});
    const [emailError, setEmailError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({});
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    // Name validation
    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        const errors = validateName(newName);
        e.target.value ? setNameErrors(errors) : setNameErrors({});
    };
    // Email validation
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        const errors = validateEmail(newEmail) ? '' : 'Invalid email address';
        e.target.value ? setEmailError(errors): setEmailError('');
    }
    // Password validation
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const errors = validatePassword(newPassword);
        e.target.value ? setPasswordErrors(errors) : setPasswordErrors({});
    }
    // Confirm password validation
    const handleConfirmPasswordChange = (e) => {
        const cPassword = e.target.value;
        setConfirmPassword(cPassword);
        const confirmPasswordError = password === cPassword ? '' : 'Passwords do not match';
        e.target.value ? setConfirmPasswordError(confirmPasswordError) : setConfirmPasswordError('');
    }

    // State to manage loading
    const [loading, setLoading] = useState(false);
    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setGeneralError('');

        // Check for empty fields
        if (!name || !email || !password || !confirmPassword) {
            setGeneralError('Every field must be filled');
        } else {
            // Check if there are no errors
            if (Object.keys(nameErrors).length === 0 && !emailError && Object.keys(passwordErrors).length === 0 && !confirmPasswordError) {
                const data = {
                    name,
                    email,
                    password
                }
                // Send data to the server
                setLoading(true);
                try {
                    // User registration api call
                    const response = await makeRequest.post('/registration', data);
                    // If the registration is success navigate to verification mail page
                    if(response.data.success){
                        navigate('/register-success');
                    }
                } catch (error) {
                    console.error('Error during registration : ', error);
                    // If the registration fails display the error message using toast
                    if (!error.response.data.success) {
                        toast.error(error.response.data.message || 'Error during registration');
                    }
                }finally{
                    setLoading(false);
                }
            }
        }
    };

    return (
        <div className='bg-primaryColor min-h-screen w-full flex flex-col py-8 xs:pt-16'>
            {/* Showing loading indicator during api call */}
            {loading && <LoadingIndicator />}
            <div className='flex flex-col gap-5 justify-center items-center'>
                <div className='flex flex-col items-center gap-2'>
                    <Logo width={"145"} height={"77"} />
                    <h1 className='text-white font-semibold text-3xl'>Bike<span className='text-black'>Buddy</span></h1>
                </div>
                <div className='bg-white flex flex-col py-8 px-10 rounded-2xl w-[350px] xs:w-[400px] shadow-lg'>
                    <h1 className='text-xl font-semibold pb-5 text-center'>Create your account</h1>
                    <form onSubmit={handleSubmit} action="" className='flex flex-col gap-5'>
                        <div>
                            <input type="text"
                                placeholder='Name'
                                value={name}
                                onChange={(e) => { handleNameChange(e) }}
                                className={`border w-full outline-none p-2 text-sm rounded-md ${Object.keys(nameErrors).length ? 'border-red-500' : `${name && Object.keys(nameErrors).length === 0 ? 'border-green-500' : 'focus:border-gray-500'}`}`}
                            />
                        </div>
                        {nameErrors.length && <p className='text-red-500 text-xs'>{nameErrors.length}</p>}
                        {nameErrors.alphabet && <p className='text-red-500 text-xs'>{nameErrors.alphabet}</p>}
                        <div>
                            <input type="text"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => { handleEmailChange(e) }}
                                className={`border w-full outline-none p-2 text-sm rounded-md ${emailError ? 'border-red-500' : `${email && !emailError ? 'border-green-500' : 'focus:border-gray-500'}`}`}
                            />
                        </div>
                        {/* Display email-specific error */}
                        {emailError && <p className='text-red-500 text-xs'>{emailError}</p>}
                        <div
                            className={`flex border  items-center text-sm rounded-md ${Object.keys(passwordErrors).length ? 'border-red-500' : `${password && Object.keys(passwordErrors).length === 0 ? 'border-green-500' : 'focus-within:border-gray-500'}`}`}>
                            <input type={showPassword ? 'text' : 'password'}
                                placeholder='Password'
                                value={password}
                                onChange={(e) => { handlePasswordChange(e) }}
                                onFocus={() => setShowEyeIcon('')}
                                onBlur={() => setShowEyeIcon('hidden')}
                                className={`w-full outline-none p-2 text-sm rounded-md `}
                            />
                            <div
                                className={`p-2 cursor-pointer ${showEyeIcon}`} onMouseDown={handleMouseDown}>
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


                        <div className={`flex border ${confirmPasswordError ? 'border-red-500' : `${confirmPassword && !confirmPasswordError ? 'border-green-500' : 'focus-within:border-gray-500'}`} items-center text-sm rounded-md`}>
                            <input type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChange={(e) => { handleConfirmPasswordChange(e) }}
                                onFocus={() => setShowConfirmEyeIcon('')}
                                onBlur={() => setShowConfirmEyeIcon('hidden')}
                                className={`w-full outline-none p-2 text-sm rounded-md`}
                            />
                            <div className={`p-2 cursor-pointer ${showConfirmEyeIcon}`} onMouseDown={handleMouseDownConfirmPassword}>
                                <span className='text-gray-500'>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        {/* Display confirm password-specific error */}
                        {confirmPasswordError && <p className='text-red-500 text-xs'>{confirmPasswordError}</p>}
                        {/* Display general error if any */}
                        {generalError && <p className='text-red-500 text-xs'>{generalError}</p>}

                        <button className='bg-primaryColor text-white py-1.5 rounded-md'>Sign Up</button>
                        <div className='text-sm pb-14'>
                            <p className='text-center font-semibold text-gray-500'>Already have an account ? <Link to={'/login'}><span className='text-primaryColor'>Login Now</span></Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp