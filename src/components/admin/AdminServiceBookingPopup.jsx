import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import makeRequest from '../../common/axios';
import DatePicker from 'react-datepicker';
import { addOneBooking } from '../../redux/features/allBookingAdminSlice';
import { toast } from 'react-toastify';

const AdminServiceBookingPopup = ({ close }) => {

    // State to manage opening animation of the popup
    const [isOpen, setIsOpen] = useState(false);

    // Access customers details from the Redux store
    const customers = useSelector((state) => state.customer.customer);

    // State to manage vehicles associated with selected customer
    const [myVehicles, setMyVehicles] = useState([]);

    const dispatch = useDispatch();

    // State to manage loading
    const [loading, setLoading] = useState(false);

    // State to manage service packages
    const [servicePackages, setServicePackages] = useState([]);

    // State to manage form inputs
    const [customerId, setCustomerId] = useState('');
    const [vehicleId, setVehicleId] = useState('');
    const [bookingDate, setBookingDate] = useState(null);
    const [serviceType, setServiceType] = useState('');
    const [pickUp, setPickUp] = useState(false);
    const [description, setDescription] = useState('');

    // Handler for when a customer is selected from the dropdown
    const handleCustomerChange = async (e) => {
        // Fetch vehicles for the selected customer
        setCustomerId(e.target.value);
        await fetchMyVehicles(e.target.value);
    }

    // Handler for when a vehicle is selected from the dropdown
    const handleVehicleChange = (e) => {
        setVehicleId(e.target.value);
    }

    // Handler for when a service type is selected from the dropdown
    const handleServiceTypeChange = (e) => {
        setServiceType(e.target.value);
    }

    // Handler for pickup and drop checkbox
    const hanlderPickUpChange = (e) => {
        setPickUp(e.target.checked);
    }

    // Handler for when the description is changed
    const handleDescription = (e) => {
        setDescription(e.target.value);
    }

    // Handler for form submission to create a new booking
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create an object with the form data
        const data = {
            customerId,
            vehicleId,
            bookingDate,
            serviceType,
            pickUp,
            description
        }
        try {
            // API call
            const response = await makeRequest.post('/add-new-booking', data);

            if (response.data.success) {
                // Show a success message
                toast.success('Booking created successfully');
                // Reset form inputs
                setCustomerId('');
                setVehicleId('');
                setBookingDate(null);
                setServiceType('');
                setPickUp(false);
                setDescription('');
                // Dispatch the newly created booking to the Redux store
                dispatch(addOneBooking(response.data.data));
                // Close the popup
                close();
            }
        } catch (error) {
            console.error('Error while creating new package: ', error);
            toast.error(error.response.data.message);
        }
    }

    // Function for fetch vehicles for the selected customer
    const fetchMyVehicles = async (customer) => {
        setLoading(true);
        try {
            // API call
            const response = await makeRequest.get(`/get-vehicles/${customer}`);
            if (response.data.success) {
                // Update the state with the fetched vehicles
                setMyVehicles(response.data.data);
            }
        } catch (error) {
            console.error('Error while fetching my vehicles: ', error);
            // Clear the state if there's an error
            setMyVehicles([]);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }

    // Function for fetch service packages from the api
    const fetchServicePackages = async () => {
        try {
            // API call
            const response = await makeRequest.get('/get-packages');
            if (response.data.success) {
                // Update the state with the fetched service packages,and reversing the order
                setServicePackages(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching service packages: ', error);
        }
    };

    // Fetch service packages when the component mounts
    useEffect(() => {
        fetchServicePackages();
    }, []);
    // Trigger the opening animation when the component mounts
    useEffect(() => {
        setIsOpen(true);
    }, []);


    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`p-4 sm:p-10 rounded-md w-full h-full transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}>
                <form className="p-4 xs:p-10 bg-white rounded-md shadow-custom max-w-lg mx-auto min-w-[320px]" onSubmit={handleSubmit}>
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl text-center sm:text-left sm:text-2xl font-semibold mb-4 ">Book a Service</h2>
                        <span
                            className='text-black text-2xl pb-2 cursor-pointer'
                            onClick={() => {
                                setIsOpen(false);
                                setTimeout(close, 300); // Close after animation
                            }}
                        >&times;</span>
                    </div>
                    {/* Customer selection */}
                    <div className="flex flex-col mb-2">
                        <p className="text-sm mb-2 text-gray-400">Select Customer <span className='text-red-600'>*</span></p>
                        <select
                            onChange={handleCustomerChange}
                            className="text-sm outline-none bg-gray-100 p-2 rounded-md"
                            required
                        >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option
                                    key={customer._id}
                                    value={customer._id}>{customer.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Vehicle selection */}
                    <div className="flex flex-col mb-2">
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
                    <div className="flex flex-col mb-2">
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
                    <div className="flex flex-col mb-2">
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
                    <div className="flex items-center mb-2">
                        <p className="text-sm mb-2 mr-4 text-gray-400">Pickup and Drop</p>
                        <input
                            type="checkbox"
                            checked={pickUp}
                            onChange={hanlderPickUpChange}
                            className='w-4 h-4'
                        />
                    </div>
                    {/* Work description */}
                    <div className="flex flex-col mb-2">
                        <p className="text-sm mb-2 text-gray-400">Description</p>
                        <textarea
                            value={description}
                            onChange={handleDescription}
                            className='border h-24 rounded-md p-2 text-sm outline-none resize-none'
                            placeholder='Work description'
                        />
                    </div>
                    {/* Submit button */}
                    <button
                        className="w-full p-2 rounded-md text-sm text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm transition-transform transform hover:scale-105"
                    >
                        Book Now
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminServiceBookingPopup