import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeRequest from '../../common/axios';
import { customerVehicleDetails } from '../../redux/features/customerVehicleSlice';
import { addNewBooking } from '../../redux/features/currentBookingSlice';
import { validatePhone } from '../../common/validations';
import { toast } from 'react-toastify';

const BreakdownBookingPopup = ({ close }) => {

  // State for animation
  const [isOpen, setIsOpen] = useState(false);

  // Access user details from the Redux store
  const user = useSelector((state) => state.user.user);
  // Access customer vehicle details from the Redux store
  const myVehicles = useSelector((state) => state.customerVehicle.customerVehicle);

  const dispatch = useDispatch();

  // State to manage loading
  const [loading, setLoading] = useState(false);

  // State to manage form inputs
  const [vehicleId, setVehicleId] = useState('');
  const [place, setPlace] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  // State to manage phone validation errors
  const [phoneError, setPhoneError] = useState({});

  // Handler for vehicle name change
  const handleVehicleChange = (e) => {
    setVehicleId(e.target.value);
  }

  // Handler for place change
  const handlePlaceChange = (e) => {
    setPlace(e.target.value);
  }

  // Phone validation
  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    const errors = validatePhone(newPhone);
    e.target.value ? setPhoneError(errors) : setPhoneError({});
  }

  // Handler for description change
  const handleDescription = (e) => {
    setDescription(e.target.value);
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      customerId: user._id,
      vehicleId,
      place,
      phone,
      description,
      breakdown: true,
      bookingDate: Date.now()
    }
    try {

      if (phone && Object.keys(phoneError).length === 0) {
        const response = await makeRequest.post('/add-new-breakdown', data);

        if (response.data.success) {
          // Show a success message
          toast.success('Booking created successfully');
          setVehicleId('');
          setPlace('');
          setPhone('');
          setDescription('');
          dispatch(addNewBooking(response.data.data));
          close();
        }
      } else {
        toast.error('Invalid phone number');
      }

    } catch (error) {
      console.error('Error while creating new package: ', error);
      //   toast.error(error.response.data.message);
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

  useEffect(() => {
    fetchMyVehicles();
  }, [])

  useEffect(() => {
    setIsOpen(true); // Trigger the opening transition
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`p-4 sm:p-10 rounded-md w-full h-full transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}>

        <form className="p-4 xs:p-10 bg-white rounded-md shadow-custom max-w-lg mx-auto relative" onSubmit={handleSubmit}>
          <h2 className="text-xl text-center sm:text-left sm:text-2xl font-semibold mb-4 ">Book a Breakdown</h2>
          <span
            className='cursor-pointer text-lg xs:text-2xl absolute top-3 right-3'
            onClick={() => {
              setIsOpen(false);
              setTimeout(close, 300); // Close after animation
            }}
          >&times;</span>
          {/* Vehicle selection */}
          <div className="flex flex-col mb-4">
            <p className="text-sm mb-2 text-gray-400">Select Vehicle <span className='text-red-600'>*</span></p>
            <select
              value={vehicleId}
              onChange={handleVehicleChange}
              className="text-sm outline-none bg-gray-100 p-2 rounded-md"
              required
            >
              <option value="">Select Vehicle</option>
              {myVehicles.map((vehicle) => (
                <option
                  key={vehicle._id}
                  value={vehicle._id}>{vehicle.registrationNumber}</option>
              ))}
            </select>
          </div>
          {/* Place input */}
          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2 text-gray-400">Place <span className='text-red-600'>*</span></label>
            <input
              type="text"
              placeholder='Place'
              onChange={handlePlaceChange}
              className='border rounded-md p-2 text-sm outline-none'
              value={place}
            />
          </div>
          {/* Phone input */}
          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2 text-gray-400">Phone <span className='text-red-600'>*</span></label>
            <input
              value={phone}
              onChange={(e) => handlePhoneChange(e)}
              className={`border rounded-md p-2 outline-none text-sm 
              ${Object.keys(phoneError).length ? 'border-red-500' : `${phone && Object.keys(phoneError).length === 0 ? 'border-green-500' : ''}`}`}
              type="text"
              placeholder='Phone' />
            {/* Display phone errors if any */}
            {phoneError.invalid && <p className='text-red-500 text-xs'>{phoneError.invalid}</p>}
            {phoneError.length && <p className='text-red-500 text-xs'>{phoneError.length}</p>}
            {phoneError.greater && <p className='text-red-500 text-xs'>{phoneError.greater}</p>}
          </div>
          {/* Work description */}
          <div className="flex flex-col mb-4">
            <p className="text-sm mb-2 text-gray-400">Description</p>
            <textarea
              value={description}
              onChange={handleDescription}
              className='border h-28 rounded-md p-2 text-sm outline-none resize-none'
              placeholder='Work description'
            />
          </div>
          {/* Submit button */}
          <button
            className="w-full bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 text-white py-1.5 rounded-lg shadow-md"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default BreakdownBookingPopup;