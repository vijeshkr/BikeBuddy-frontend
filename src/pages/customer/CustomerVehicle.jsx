import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import makeRequest from '../../common/axios';
import { validateVehicleRegistration } from '../../common/validations';
import { toast } from 'react-toastify';
import { NavLink, Outlet } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customerVehicleDetails, addCustomerVehicle } from '../../redux/features/customerVehicleSlice';
import profilePlaceholder from '../../assets/profile.png';

const CustomerVehicle = () => {

  // Access user details from the Redux store
  const user = useSelector((state) => state.user.user);
  // Access customer vehicle details from the Redux store
  const myVehicles = useSelector((state) => state.customerVehicle.customerVehicle);

  // State to manage all vehicles
  const [allVehicles, setAllVehicles] = useState([]);
  // State to manage loading
  const [loading, setLoading] = useState(false);
  // State to manage reg number
  const [regNumber, setRegNumber] = useState('');
  // State to manage Model
  const [model, setModel] = useState('');
  // State to manage registration date
  const [registrationDate, setRegistrationDate] = useState();

  // State to manage reg number error
  const [regNumberError, setRegNumberError] = useState('');
  // State to manage general error
  const [generalError, setGeneralError] = useState('');

  const dispatch = useDispatch();

  // Registration number validation
  const handleRegNumberChange = (e) => {
    const newRegNumber = e.target.value;
    setRegNumber(newRegNumber);
    const errors = validateVehicleRegistration(newRegNumber) ? '' : 'Invalid registration number';
    e.target.value ? setRegNumberError(errors) : setRegNumberError('');
  }

  // Handle change in the form
  const handleOnChangeModel = (e) => {
    setModel(e.target.value);
  }

  // Function for fetch vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get('/get-all-vehicles');
      if (response.data.success) {
        setAllVehicles(response.data.data);
      }
    } catch (error) {
      console.error('Error while fetching vehicles: ', error);
    } finally {
      setLoading(false);
    }
  }

  // Function for fetch my vehicles
  const fetchMyVehicles = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get(`/get-vehicles/${user._id}`);
      if (response.data.success) {
        dispatch(customerVehicleDetails({ customerVehicle: response.data.data }));
      }
    } catch (error) {
      console.error('Error while fetching my vehicles: ', error);
    } finally {
      setLoading(false);
    }
  }

  // Handle submit 
  const handleFormSubmitVehicle = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setGeneralError('');

    // Check for empty fields
    if (!registrationDate || !regNumber || !model) {
      setGeneralError('Every field must be filled');
    } else {

      // Check if there are no errors
      if (!regNumberError) {
        const data = {
          customer: user._id,
          modelName: model,
          registrationNumber: regNumber,
          registrationDate: registrationDate
        }

        setLoading(true);
        try {

          const response = await makeRequest.post('/add-vehicle', data);
          if (response.data.success) {
            toast.success(response.data.message);
            dispatch(addCustomerVehicle(response.data.data));
            setModel('');
            setRegNumber('');
            setRegistrationDate();
          }
        } catch (error) {
          console.error('Failed to create new vehicle:', error);
          toast.error(error.response.data.message);
        } finally {
          setLoading(false);
        }
      }
    }

  }

  useEffect(() => {
    fetchVehicles();
    fetchMyVehicles();
  }, []);

  return (
    <div className='w-full'>
      {loading && <LoadingIndicator />}
      <div className='flex flex-wrap justify-center lg:p-10 gap-4 '>

        {/* Create new vehicle */}
        <div className="min-w-[350px] max-w-sm p-4 bg-white shadow-custom rounded-lg flex-1">
          <h1 className='text-2xl font-semibold mb-4'>Create New Vehicle</h1>
          <form
            onSubmit={handleFormSubmitVehicle}
            className='flex flex-col gap-3'>

            <div className='flex flex-col'>
              <p className='text-sm mb-1 text-gray-400'>User name</p>
              <h1 className='text-lg font-medium'>{user.name}</h1>
            </div>

            <div className="flex flex-col">
              <label
                className="text-sm mb-1 text-gray-400"
                htmlFor="registrationDate">Registration Date <span className='text-red-600'>*</span></label>
              <DatePicker
                selected={registrationDate}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setRegistrationDate(date)}
                id="registrationDate"
                required
                placeholderText="Select date"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={25}
                maxDate={new Date()}
                className="text-sm outline-none bg-gray-100 p-2 rounded-md w-full"
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 text-gray-400 `}
                htmlFor="registrationNumber">Registration Number <span className='text-red-600'>*</span></label>

              <input
                value={regNumber}
                placeholder='Format: KL-08-BB-1010'
                onChange={(e) => handleRegNumberChange(e)}
                className={`p-2 border rounded-md outline-none text-sm 
                ${regNumberError ? 'border-red-500' : `${regNumber && !regNumberError ? 'border-green-500' : ''}`}`}
                type="text" id='registrationNumber' />

              {/* Display registration number-specific error */}
              {regNumberError && <p className='text-red-500 text-xs'>{regNumberError}</p>}
            </div>

            <div className="flex flex-col">
              <p className="text-sm mb-1 text-gray-400">Model <span className='text-red-600'>*</span></p>
              <select
                value={model}
                onChange={handleOnChangeModel}
                className='text-sm outline-none bg-gray-100 p-2 rounded-md'>
                <option value="">Select an option</option>
                {allVehicles.map((vehicle, index) => (
                  <option
                    key={index}
                    value={vehicle._id}>{vehicle.name}</option>
                ))}
              </select>
            </div>
            {generalError && <p className='text-red-500 text-xs'>{generalError}</p>}


            <button className='w-full py-2 rounded-md text-sm text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm'>{loading ? 'Creating...' : 'Create Vehicle'}</button>
          </form>
        </div>

        {/* Profile info and my vehicles */}
        <div className='shadow-custom flex flex-col gap-3 p-4 rounded-lg bg-white min-w-[350px] max-w-sm flex-1'>
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

            <p className='text-sm text-gray-400 py-1'>My Vehicles</p>
            {
              myVehicles.length === 0 ? 'No vehicles available' :
                <div className='max-h-48 overflow-y-auto scrollbar-none'>
                  {
                    myVehicles.map((vehicle, index) => (
                      <NavLink key={vehicle._id}
                        className={({ isActive }) =>
                          isActive ? 'bg-bb-theme-200 p-1 m-1 flex rounded-md text-bb-theme-700 gap-3' : 'p-1 flex m-1 rounded-sm'
                        }
                        to={`my-vehicle/${vehicle._id}`}>
                        <button className='w-full'>
                          <div className='flex justify-between px-5'>
                            <p>{vehicle.modelName.name}</p>
                            <h1>{vehicle.registrationNumber}</h1>
                          </div>
                        </button>

                      </NavLink>
                    ))
                  }
                </div>
            }
          </div>

        </div>
        {/* Outlet */}
        {myVehicles.length !== 0 &&
          <div className='flex-1 shadow-custom p-4 rounded-lg bg-white min-w-[350px] max-w-sm'>
            <Outlet />
          </div>}
      </div>

    </div>
  )
}

export default CustomerVehicle;