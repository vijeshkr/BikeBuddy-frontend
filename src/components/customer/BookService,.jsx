import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import makeRequest from '../../common/axios';
import { customerVehicleDetails, replaceCustomerVehicle } from '../../redux/features/customerVehicleSlice';
import { toast } from 'react-toastify';
import { addNewBooking } from '../../redux/features/currentBookingSlice';

const BookService = () => {
    // Fetching user and vehicle details from Redux store
    const user = useSelector((state) => state.user.user);
    const myVehicles = useSelector((state) => state.customerVehicle.customerVehicle);

    const dispatch = useDispatch();

    // State to manage loading
    const [loading, setLoading] = useState(false);
    // State to store service packages from the server
    const [servicePackages, setServicePackages] = useState([]);

    // Form state
    const [vehicleId, setVehicleId] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);  // Holds the selected vehicle object
    const [bookingDate, setBookingDate] = useState(null);
    const [serviceType, setServiceType] = useState('');
    const [pickUp, setPickUp] = useState(false);
    const [description, setDescription] = useState('');

    // Handler for vehicle selection change
    const handleVehicleChange = (e) => {
        const selectedVehicleId = e.target.value;
        setVehicleId(selectedVehicleId);

        // Find and set the selected vehicle object from the list
        const foundVehicle = myVehicles.find((vehicle) => vehicle._id === selectedVehicleId);
        setSelectedVehicle(foundVehicle);
    };

    // Handler for service type selection change
    const handleServiceTypeChange = (e) => {
        setServiceType(e.target.value);
    };

    // Handler for pickup and drop checkbox change
    const handlePickUpChange = (e) => {
        setPickUp(e.target.checked);
    };

    // Handler for description change
    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    // Handle form submission for booking service
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            customerId: user._id,
            vehicleId: selectedVehicle._id,
            bookingDate,
            serviceType,
            pickUp,
            description
        };

        try {
            const response = await makeRequest.post('/add-new-booking', data);

            if (response.data.success) {
                toast.success('Booking created successfully');
                // Reset form fields after successful booking
                setVehicleId('');
                setSelectedVehicle(null);
                setBookingDate(null);
                setServiceType('');
                setPickUp(false);
                setDescription('');
                dispatch(addNewBooking(response.data.data.bookingData));
                dispatch(replaceCustomerVehicle(response.data.data.customerVehicle));
            }
        } catch (error) {
            console.error('Error while creating new package: ', error);
            // toast.error('Failed to create booking');
            toast.error(error.response.data.message);
        }
    };

    // Fetch user vehicles
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
    };

    // Fetch service packages from the server
    const fetchServicePackages = async () => {
        try {
            const response = await makeRequest.get('/get-packages');
            if (response.data.success) {
                // Reverse the order and set service packages
                setServicePackages(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching service packages: ', error);
        }
    };

    useEffect(() => {
        // Fetch vehicles and service packages on component mount
        fetchMyVehicles();
        fetchServicePackages();
    }, []);

    // Filter service packages based on whether free service is available
    const availableServicePackages = selectedVehicle && selectedVehicle.freeServiceEligibility
        ? servicePackages.filter(pkg => pkg.price === 0)  // Only show free services
        : servicePackages.filter(pkg => pkg.price > 0);   // Exclude free services

    return (
        <form className="p-2 bg-white rounded-md shadow-custom max-w-lg mx-auto" onSubmit={handleSubmit}>
            <h2 className="text-xl text-center sm:text-left sm:text-2xl font-semibold mb-4">Book a Service</h2>

            {/* Vehicle selection dropdown */}
            <div className="flex flex-col mb-4">
                <p className="text-sm mb-2 text-gray-400">Select Vehicle <span className='text-red-600'>*</span></p>
                <select
                    value={vehicleId || ''}
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

            {/* Service type selection dropdown */}
            <div className="flex flex-col mb-4">
                <p className="text-sm mb-2 text-gray-400">Select Service Type <span className='text-red-600'>*</span>
                    {/* Free service eligibility message */}
                    {selectedVehicle && selectedVehicle.freeServiceEligibility && (
                        <span className="text-green-500 text-sm"> Free service available.</span>
                    )}
                </p>
                <select
                    value={serviceType || ''}
                    onChange={handleServiceTypeChange}
                    required
                    className="text-sm outline-none bg-gray-100 p-2 rounded-md"
                >
                    <option value="">Select Service Type</option>
                    {availableServicePackages.map((pkg) => (
                        <option key={pkg._id} value={pkg._id}>
                            {pkg.packageName} {pkg.price > 0 && `- ₹${pkg.price}`}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pickup and drop checkbox */}
            <div className="flex items-center mb-4">
                <p className="text-sm mb-2 mr-4 text-gray-400">Pickup and Drop</p>
                <input
                    type="checkbox"
                    checked={pickUp}
                    onChange={handlePickUpChange}
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
                disabled={loading}  // Disable button when loading
            >
                Book Now
            </button>
        </form>
    );
};

export default BookService;
