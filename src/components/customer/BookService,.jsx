import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import makeRequest from '../../common/axios';
import { customerVehicleDetails } from '../../redux/features/customerVehicleSlice';
import { toast } from 'react-toastify';
import { addNewBooking } from '../../redux/features/currentBookingSlice';

/**
 * BookService Component
 * 
 * This component allows the customer to book a service for their vehicle.
 * The form includes fields for selecting vehicle, booking date, service type,
 * pickup and drop option, and a description for work.
 * 
 * @returns JSX element
 */

const BookService = () => {
    // Access user details from the Redux store
    const user = useSelector((state) => state.user.user);
    // Access customer vehicle details from the Redux store
    const myVehicles = useSelector((state) => state.customerVehicle.customerVehicle);

    const dispatch = useDispatch();

    // State to manage loading
    const [loading, setLoading] = useState(false);
    // State to manage service packages
    const [servicePackages, setServicePackages] = useState([]);

    // State to manage form inputs
    const [vehicleId, setVehicleId] = useState('');
    const [bookingDate, setBookingDate] = useState(null);
    const [serviceType, setServiceType] = useState('');
    const [pickUp, setPickUp] = useState(false);
    const [description, setDescription] = useState('');

    // Handler for vehicle name change
    const handleVehicleChange = (e) => {
        setVehicleId(e.target.value);
    }

    // Handler for service type change
    const handleServiceTypeChange = (e) => {
        setServiceType(e.target.value);
    }

    // Handler for pickup and drop change
    const hanlderPickUpChange = (e) => {
        setPickUp(e.target.checked);
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
            bookingDate,
            serviceType,
            pickUp,
            description
        }
        try {
            const response = await makeRequest.post('/add-new-booking', data);

            if (response.data.success) {
                // Show a success message
                toast.success('Booking created successfully');
                setVehicleId('');
                setBookingDate(null);
                setServiceType('');
                setPickUp(false);
                setDescription('');
                dispatch(addNewBooking(response.data.data));
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

    // Function for fetch service packages from the api
    const fetchServicePackages = async () => {
        try {
            const response = await makeRequest.get('/get-packages');
            if (response.data.success) {
                setServicePackages(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching service packages: ', error);
        }
    };

    useEffect(() => {
        fetchMyVehicles();
        fetchServicePackages();
    }, [])


    return (
        <form className="p-2 bg-white rounded-md shadow-custom max-w-lg mx-auto" onSubmit={handleSubmit}>
            <h2 className="text-xl text-center sm:text-left sm:text-2xl font-semibold mb-4 ">Book a Service</h2>

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
            {/* Booking date selection */}
            <div className="flex flex-col mb-4">
                <label className="text-sm mb-2 text-gray-400">Select Date <span className='text-red-600'>*</span></label>
                <DatePicker
                    selected={bookingDate}
                    onChange={(date) => setBookingDate(date)}
                    dateFormat="dd/MM/yyyy"
                    required
                    minDate={new Date()}
                    autoComplete='off'
                    placeholderText="Select date"
                    className="text-sm outline-none bg-gray-100 p-2 rounded-md w-full"
                />
            </div>
            {/* Service type selection */}
            <div className="flex flex-col mb-4">
                <p className="text-sm mb-2 text-gray-400">Select Service Type <span className='text-red-600'>*</span></p>
                <select
                    value={serviceType}
                    onChange={handleServiceTypeChange}
                    required
                    className="text-sm outline-none bg-gray-100 p-2 rounded-md"
                >
                    <option value="">Select Service Type</option>
                    {servicePackages.map((pkg) => (
                        <option
                            key={pkg._id}
                            value={pkg._id}>{pkg.packageName}</option>
                    ))}
                </select>
            </div>
            {/* Pickup and drop option */}
            <div className="flex items-center mb-4">
                <p className="text-sm mb-2 mr-4 text-gray-400">Pickup and Drop</p>
                <input
                    type="checkbox"
                    checked={pickUp}
                    onChange={hanlderPickUpChange}
                    className='w-4 h-4'
                />
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
                className="w-full bg-primaryColor text-white py-2 rounded-md shadow-md hover:opacity-90 transition duration-300"
            >
                Book Now
            </button>
        </form>
    );
};

export default BookService;
