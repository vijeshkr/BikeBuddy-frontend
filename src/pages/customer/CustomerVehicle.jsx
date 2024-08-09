import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import makeRequest from '../../common/axios';
import { validateVehicleRegistration } from '../../common/validations';
import { toast } from 'react-toastify';
import { NavLink, Outlet } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customerVehicleDetails } from '../../redux/features/customerVehicleSlice';

const CustomerVehicle = () => {
  const user = useSelector((state) => state.user.user);
  // State to manage all vehicles
  const [allVehicles, setAllVehicles] = useState([]);
  // State to manage loading
  const [loading, setLoading] = useState(false);
  // State to manage reg number
  const [regNumber, setRegNumber] = useState('');
  // State to manage Model
  const [model, setModel] = useState('');
  // State to manage registration date
  const [registrationDate, setRegistrationDate] = useState(new Date());
  // State to manage my vehicles
  const [myVehicles, setMyVehicles] = useState([]);

  // State to manage reg number error
  const [regNumberError, setRegNumberError] = useState('');
  // State to manage general error
  const [generalError, setGeneralError] = useState('');

  const dispatch = useDispatch();

  // Registration number validation
  // Email validation
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
        setMyVehicles(response.data.data);
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
            fetchMyVehicles();
            setModel('');
            setRegNumber('');
            setRegistrationDate(new Date());
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
                htmlFor="registrationDate">Registration Date</label>
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
              />
            </div>


            <div className="flex flex-col">
              <label
                className={`text-sm mb-1 text-gray-400 `}
                htmlFor="registrationNumber">Registration Number</label>

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
              <p className="text-sm mb-1 text-gray-400">Model</p>
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


            <button className='bg-primaryColor hover:bg-opacity-95 active:bg-primaryColor py-1 w-full text-white rounded-md'>Create Vehicle</button>
          </form>
        </div>

        {/* Profile info and my vehicles */}
        <div className='shadow-custom flex flex-col gap-3 p-4 rounded-lg min-w-[350px] max-w-sm flex-1'>
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
                <div>
                  {
                    myVehicles.map((vehicle, index) => (
                      <NavLink key={index} index={index === 0}
                        className={({ isActive }) =>
                          isActive ? 'bg-fuchsia-50 p-1 m-1 flex rounded-sm text-fuchsia-800 gap-3' : 'p-1 flex m-1 rounded-sm'
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
        {/* Outler */}
        <div className='flex-1 shadow-custom p-4 rouded-lg min-w-[350px] max-w-sm'>
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default CustomerVehicle;