import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Logo from '../../logo/Logo';
import { Link, useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/LoadingIndicator';
import { validateEmail, validatePassword } from '../../common/validations';
import makeRequest from '../../common/axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/features/loadingSlice';
import { userDetails } from '../../redux/features/userSlice';

const Login = () => {

    const navigate = useNavigate();
    // State to manage password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showEyeIcon, setShowEyeIcon] = useState('hidden');

    // State hook for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State hook for the errors
    const [emailError, setEmailError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    // Loading state from redux
    const loading = useSelector((state) => state.loading);
    const dispatch = useDispatch();

    // Eye icon toggle fuction for password visibility
    const handleMouseDown = (e) => {
        // Prevents losing focus on the input field
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    // Email validation
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        const errors = validateEmail(email) ? '' : 'Invalid email address';
        e.target.value ? setEmailError(errors) : setEmailError('');
    }
    // Password validation
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const errors = validatePassword(newPassword);
        e.target.value ? setPasswordErrors(errors) : setPasswordErrors({});
    }

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setGeneralError('');

        // Check for empty fields
        if (!email || !password) {
            setGeneralError('Every field must be filled');
        } else {
            // Check if there are no errors
            if (!emailError && Object.keys(passwordErrors).length === 0) {
                const data = {
                    email,
                    password
                }
                // Send data to the server
                dispatch(setLoading(true));
                try {
                    // User registration api call
                    const response = await makeRequest.post('/login', data);
                    // If the registration is success navigate to verification mail page
                    if (response.data.success) {
                        toast.success('Login successful');
                        dispatch(userDetails({ user: response.data.result.user }));
                        dispatch(setLoading(false));
                        if (response.data.result.user.role === 'customer') {
                            navigate('/');
                        } else if (response.data.result.user.role === 'mechanic') {
                            navigate('/mechanic');
                        } else if (response.data.result.user.role === 'admin') {
                            navigate('/admin');
                        }
                    }
                } catch (error) {
                    console.error('Error during logged in : ', error);
                    // If the logged in fails display the error message using toast
                    if (error.response.data.pendingVerification) {
                        toast.error('Email is not verified');
                        navigate('/register-success');
                    } else if (!error.response.data.success) {
                        toast.error(error?.response?.data?.message || 'Error during logged in');
                    }
                } finally {
                    dispatch(setLoading(false));
                }
            }
        }
    };


    return (
        <div className='bg-bb-theme-900 h-screen w-full flex flex-col pt-8 xs:pt-16'>
            {/* Showing loading indicator during api call */}
            {loading && <LoadingIndicator />}
            <div className='flex flex-col gap-5 justify-center items-center'>
                <div className='flex flex-col items-center gap-2'>
                    <Logo width={"145"} height={"77"} />
                    <h1 className='text-white font-semibold text-3xl'>Bike<span className='text-black'>Buddy</span></h1>
                </div>
                <div className='bg-white flex flex-col py-8 px-10 rounded-2xl w-[350px] xs:w-[400px] shadow-lg'>
                    <h1 className='text-xl font-semibold pb-5 text-center'>Login to your account</h1>
                    <form onSubmit={handleSubmit} action="" className='flex flex-col gap-5'>
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
                        <div>
                            <Link to={'/forgot-password'}><p className='text-bb-theme-900 text-end font-semibold text-sm'>Forgot Password ?</p></Link>
                        </div>
                        {/* Display general error if any */}
                        {generalError && <p className='text-red-500 text-xs'>{generalError}</p>}
                        <button className='bg-bb-theme-900 text-white py-1.5 rounded-md'>Sign In</button>
                        <div className='text-sm pb-14'>
                            <p className='text-center font-semibold text-gray-500'>Don't have an account ? <Link to={'/register'}><span className='text-bb-theme-900'>Get Started</span></Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;