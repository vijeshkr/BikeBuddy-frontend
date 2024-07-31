import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import profilePlaceholder from '../../assets/profile.png';
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { FaMobileAlt } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { validateEmail, validateName, validatePassword, validatePhone } from '../../common/validations';
import { toast } from 'react-toastify';
import LoadingIndicator from '../../components/LoadingIndicator';
import makeRequest from '../../common/axios';
import { handleImageUpload } from '../../common/utils';
import { userDetails } from '../../redux/features/userSlice';

const ProfilePage = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();


  // Hooks for manage password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Hooks for password visibility icon
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showOldEyeIcon, setShowOldEyeIcon] = useState('hidden');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewEyeIcon, setShowNewEyeIcon] = useState('hidden');

  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showConfirmNewEyeIcon, setShowConfirmNewEyeIcon] = useState('hidden');

  const [loading, setLoading] = useState(false);

  // Eye icon toggle fuction for password visibility
  const handleMouseDownOld = (e) => {
    // Prevents losing focus on the input field
    e.preventDefault();
    setShowOldPassword(!showOldPassword);
  };

  // Eye icon toggle fuction for password visibility
  const handleMouseDownNew = (e) => {
    // Prevents losing focus on the input field
    e.preventDefault();
    setShowNewPassword(!showNewPassword);
  };

  // Eye toggle funcion for confirm password
  const handleMouseDownConfirmPassword = (e) => {
    // Prevents losing focus on the input field
    e.preventDefault();
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  // State hook for the errors
  const [oldPasswordErrors, setOldPasswordErrors] = useState({});
  const [newPasswordErrors, setNewPasswordErrors] = useState({});
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
  const [generalPasswordError, setGeneralPasswordError] = useState('');

  // Old password validation
  const handleOldPasswordChange = (e) => {
    const newUserPassword = e.target.value;
    setOldPassword(newUserPassword);
    const errors = validatePassword(newUserPassword);
    e.target.value ? setOldPasswordErrors(errors) : setOldPasswordErrors({});
  }
  // Password validation
  const handleNewPasswordChange = (e) => {
    const newUserPassword = e.target.value;
    setNewPassword(newUserPassword);
    const errors = validatePassword(newUserPassword);
    e.target.value ? setNewPasswordErrors(errors) : setNewPasswordErrors({});
  }
  // Confirm password validation
  const handleConfirmNewPasswordChange = (e) => {
    const cPassword = e.target.value;
    setConfirmNewPassword(cPassword);
    const confirmPasswordError = newPassword === cPassword ? '' : 'Passwords do not match';
    e.target.value ? setConfirmNewPasswordError(confirmPasswordError) : setConfirmNewPasswordError('');
  }

  // Form submission handler password change
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setGeneralPasswordError('');

    // Check for empty fields
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setGeneralPasswordError('Every field must be filled');
    } else {
      // Check if there are no errors
      if (Object.keys(oldPasswordErrors).length === 0 && Object.keys(newPasswordErrors).length === 0 && !confirmNewPasswordError) {
        // Send data to the server
        setLoading(true);
        try {
          const response = await makeRequest.post('/user-password-change', { oldPassword, newPassword, confirmNewPassword });
          if (response.data.success) {
            toast.success('Password successfully updated');
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
          }
        } catch (error) {
          console.error('Error during resetting password: ', error);
          toast.error(error.response.data.message);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // State for update photo toggle
  const [updatePhoto, setUpdatePhoto] = useState(false);

  // Update photo open close toggle function
  const openUpdatePhoto = () => {
    setUpdatePhoto(!updatePhoto);
  }

  // Profile update section
  // Hooks for manage form data
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [place, setPlace] = useState(user.place);
  const [phone, setPhone] = useState(user.phone);
  const [profilePicture, setProfilePicture] = useState(null);

  // Hooks for manage errors
  const [nameError, setNameError] = useState({});
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState({});

  // Name validation
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    const errors = validateName(newName);
    e.target.value ? setNameError(errors) : setNameError({});
  };
  // Email validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const errors = validateEmail(newEmail) ? '' : 'Invalid email address';
    e.target.value ? setEmailError(errors) : setEmailError('');
  }
  // Phone validation
  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    const errors = validatePhone(newPhone);
    e.target.value ? setPhoneError(errors) : setPhoneError({});
  }

  // Profile picture change
  const handleProfilePictureChange = (e) => {
    if (e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    } else {
      setProfilePicture(null);
    }
  }

  // Form submission handler for profile update
  const handleSubmitUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    let profilePictureUrl = user.profilePicture;

    try {
      if (profilePicture) profilePictureUrl = await handleImageUpload(profilePicture);
      const updatedUserData = { name, email, place, phone, profilePicture: profilePictureUrl };

      // Function to check if there any changes
      const hasChanges = (
        user.name !== updatedUserData.name ||
        user.email !== updatedUserData.email ||
        user.place !== updatedUserData.place ||
        user.phone !== updatedUserData.phone ||
        user.profilePicture !== updatedUserData.profilePicture
      );

      if (!hasChanges) {
        toast.info('No changes detected.');
        setLoading(false);
        return;
      }

      // Api call for update profile
      const response = await makeRequest.put('/update-profile', updatedUserData);
      if (response.data.success) {
        toast.success('Profile updated successfully');
        // Set data in redux
        dispatch(userDetails({ user: response.data.data }));
      }

    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }

  }

  // Profile picture remove reset input
  const fileInputRef = React.useRef(null);

  // Remove profile picture only
  const removePhoto = async () => {
    setLoading(true);
    try {
      if (profilePicture) {
        setProfilePicture(null)
      } else if (user.profilePicture !== null) {
        const response = await makeRequest.patch('/remove-profile-picture');
        if (response.data.success) {
          toast.success('Profile picture removed');
          setProfilePicture(null);
          dispatch(userDetails({ user: response.data.data }));

          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
        }
      } else {
        toast.error('Profile picture not found');
      }
    } catch (error) {
      console.error('Error while removing profile picture', error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {loading && <LoadingIndicator />}

      <h1 className='text-2xl font-semibold p-4'>User Profile</h1>

      <div className='flex flex-wrap gap-6 '>

        {/* Current user details  */}

        <div className='shadow-custom flex flex-col gap-4 flex-1 p-4 md:h-[470px] min-w-[300px] '>
          <div>
            <img className='h-36 w-36 object-cover rounded-full border'
              src={
                user.profilePicture
                  ? `${import.meta.env.VITE_BACKEND_URL}/images/${user.profilePicture}`
                  :
                  profilePlaceholder} alt="" />
          </div>

          <div className='flex flex-col gap-4'>
            <h1 className='text-xl font-semibold'>{user.name}</h1>

            <p className='text-sm text-gray-400 py-3'>Contact Details</p>

            <div className='flex items-center gap-2'>
              <span className='pt-1 text-lg'><IoMailOutline /></span>
              <p className='text-sm'>{user.email}</p>
            </div>

            {user.phone && <div className='flex items-center gap-2'>
              <span className='pt-1 text-lg'><FaMobileAlt /></span>
              <p className='text-sm'>{user.phone}</p>
            </div>}

            {user.place && <div className='flex items-center gap-2'>
              <span className='pt-1 text-lg'><TbCurrentLocation /></span>
              <p className='text-sm'>{user.place}</p>
            </div>}
          </div>

        </div>

        {/* Update profile */}
        <form onSubmit={handleSubmitUpdateProfile} encType="multipart/form-data" className='flex flex-col gap-5 flex-1 shadow-custom  p-4 md:h-[470px] min-w-[300px]'>

          <div className='relative flex'>

            <div className='relative inline-block'>
              <img className='h-36 w-36 object-cover rounded-full border'
                src={
                  profilePicture
                    ? URL.createObjectURL(profilePicture)
                    :
                    user.profilePicture
                      ? `${import.meta.env.VITE_BACKEND_URL}/images/${user.profilePicture}`
                      : profilePlaceholder
                } alt="" />

              <span
                onClick={openUpdatePhoto}
                className='text-2xl absolute bottom-0 right-0 border rounded-full p-2 bg-blue-100 active:bg-blue-200 cursor-pointer'>
                <FaCloudUploadAlt />
              </span>
            </div>

            {/* Profile pic update or remove */}
            <div className={`flex flex-col justify-center items-center gap-2 p-2 text-xs ${!updatePhoto ? `hidden` : ``}`}>

              <label className='border p-1 rounded-sm cursor-pointer bg-gray-100 hover:bg-gray-200 active:bg-gray-300'>Update photo
                <input ref={fileInputRef} onChange={(e) => handleProfilePictureChange(e)} type="file" className='hidden' />
              </label>
              <span onClick={removePhoto} className='border p-1 rounded-sm cursor-pointer bg-gray-100 hover:bg-gray-200 active:bg-gray-300'>Remove photo</span>
            </div>
          </div>

          <input
            value={name}
            onChange={(e) => handleNameChange(e)}
            className={`border-b border-black p-2 outline-none text-sm 
          ${Object.keys(nameError).length ? 'border-red-500' : `${name && Object.keys(nameError).length === 0 ? 'border-green-500' : ''}`}`}
            type="text"
            placeholder='Name' />
          {/* Display name errors if any */}
          {nameError.length && <p className='text-red-500 text-xs'>{nameError.length}</p>}
          {nameError.alphabet && <p className='text-red-500 text-xs'>{nameError.alphabet}</p>}


          <input
            value={email}
            onChange={(e) => handleEmailChange(e)}
            className={`border-b border-black p-2 outline-none text-sm 
            ${emailError ? 'border-red-500' : `${email && !emailError ? 'border-green-500' : ''}`}`}
            type="text"
            placeholder='Email' />
          {/* Display email-specific error */}
          {emailError && <p className='text-red-500 text-xs'>{emailError}</p>}

          <input
            value={phone}
            onChange={(e) => handlePhoneChange(e)}
            className={`border-b border-black p-2 outline-none text-sm 
          ${Object.keys(phoneError).length ? 'border-red-500' : `${phone && Object.keys(phoneError).length === 0 ? 'border-green-500' : ''}`}`}
            type="text"
            placeholder='Phone' />
          {/* Display phone errors if any */}
          {phoneError.invalid && <p className='text-red-500 text-xs'>{phoneError.invalid}</p>}
          {phoneError.length && <p className='text-red-500 text-xs'>{phoneError.length}</p>}
          {phoneError.greater && <p className='text-red-500 text-xs'>{phoneError.greater}</p>}

          <input
            value={place}
            onChange={(e) => { setPlace(e.target.value) }}
            className={`border-b border-black p-2 outline-none text-sm ${place ? 'border-green-500' : ''}`}
            type="text"
            placeholder='Location' />

          <button className='border hover:bg-opacity-95 active:bg-primaryColor p-1 rounded-sm text-sm bg-primaryColor text-white'>Update profile</button>

        </form>



        {/* Reset password */}
        <form onSubmit={handleSubmitPasswordChange} className='flex flex-col gap-6 shadow-custom flex-1 p-4 text-sm lg:h-[470px] min-w-[300px]'>
          {/* Old password */}
          <div
            className={`flex border-b border-black items-center text-sm ${Object.keys(oldPasswordErrors).length ? 'border-red-500' : `${oldPassword && Object.keys(oldPasswordErrors).length === 0 ? 'border-green-500' : ''}`}`}>
            <input type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              placeholder='Password'
              onFocus={() => setShowOldEyeIcon('')}
              onBlur={() => setShowOldEyeIcon('hidden')}
              onChange={(e) => { handleOldPasswordChange(e) }}
              className='w-full outline-none p-2 text-sm rounded-md' />
            <div className={`p-2 cursor-pointer ${showOldEyeIcon}`} onMouseDown={handleMouseDownOld}>
              <span className='text-gray-500'>
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Display old-password-specific errors */}
          {oldPasswordErrors.uppercase && <p className='text-red-500 text-xs'>{oldPasswordErrors.uppercase}</p>}
          {oldPasswordErrors.lowercase && <p className='text-red-500 text-xs'>{oldPasswordErrors.lowercase}</p>}
          {oldPasswordErrors.number && <p className='text-red-500 text-xs'>{oldPasswordErrors.number}</p>}
          {oldPasswordErrors.special && <p className='text-red-500 text-xs'>{oldPasswordErrors.special}</p>}
          {oldPasswordErrors.length && <p className='text-red-500 text-xs'>{oldPasswordErrors.length}</p>}

          {/* New password */}
          <div
            className={`flex border-b border-black items-center text-sm ${Object.keys(newPasswordErrors).length ? 'border-red-500' : `${newPassword && Object.keys(newPasswordErrors).length === 0 ? 'border-green-500' : ''}`}`}>
            <input type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              placeholder='New password'
              onFocus={() => setShowNewEyeIcon('')}
              onBlur={() => setShowNewEyeIcon('hidden')}
              onChange={(e) => { handleNewPasswordChange(e) }}
              className='w-full outline-none p-2 text-sm rounded-md' />
            <div className={`p-2 cursor-pointer ${showNewEyeIcon}`} onMouseDown={handleMouseDownNew}>
              <span className='text-gray-500'>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Display new-password-specific errors */}
          {newPasswordErrors.uppercase && <p className='text-red-500 text-xs'>{newPasswordErrors.uppercase}</p>}
          {newPasswordErrors.lowercase && <p className='text-red-500 text-xs'>{newPasswordErrors.lowercase}</p>}
          {newPasswordErrors.number && <p className='text-red-500 text-xs'>{newPasswordErrors.number}</p>}
          {newPasswordErrors.special && <p className='text-red-500 text-xs'>{newPasswordErrors.special}</p>}
          {newPasswordErrors.length && <p className='text-red-500 text-xs'>{newPasswordErrors.length}</p>}

          {/* Confirm password */}
          <div
            className={`flex border-b border-black items-center text-sm ${Object.keys(confirmNewPasswordError).length ? 'border-red-500' : `${confirmNewPassword && Object.keys(confirmNewPasswordError).length === 0 ? 'border-green-500' : ''}`}`}>
            <input type={showConfirmNewPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              placeholder='Confirm new password'
              onFocus={() => setShowConfirmNewEyeIcon('')}
              onBlur={() => setShowConfirmNewEyeIcon('hidden')}
              onChange={(e) => { handleConfirmNewPasswordChange(e) }}
              className='w-full outline-none p-2 text-sm rounded-md' />
            <div className={`p-2 cursor-pointer ${showConfirmNewEyeIcon}`} onMouseDown={handleMouseDownConfirmPassword}>
              <span className='text-gray-500'>
                {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          {/* Display confirm password error */}
          {confirmNewPasswordError && <p className='text-red-500 text-xs'>{confirmNewPasswordError}</p>}
          {/* Display general error if any */}
          {generalPasswordError && <p className='text-red-500 text-xs'>{generalPasswordError}</p>}

          <button className='border hover:bg-opacity-95 active:bg-primaryColor p-1 rounded-sm text-sm bg-primaryColor text-white'>Reset password</button>
        </form>
      </div>

    </div >
  )
}


export default ProfilePage;