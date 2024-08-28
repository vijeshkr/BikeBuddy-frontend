import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMechanicDetails } from '../../redux/features/mechanicSlice';
import makeRequest from '../../common/axios';
import { toast } from 'react-toastify';

const AllocationPopup = ({ close, booking, fetchBookings }) => {

    // State to manage loading
    const [loading, setLoading] = useState(false);
    // State to manage selected mechanic
    const [selectedMechanic, setSelectedMechanic] = useState('');
    // Access mechanics data from the Redux store
    const mechanics = useSelector((state) => state.mechanic.mechanic);

    const dispatch = useDispatch();

    const role = 'mechanic';

    // Handle select change
    const handleOnChange = (event) => {
        setSelectedMechanic(event.target.value);
    };


    // Handle submit function
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedMechanic) {
            // Data mechanic id and booking id
            const data = {
                mechanicId: selectedMechanic,
                bookingId: booking._id
            }

            setLoading(true);
            try {
                const response = await makeRequest.post('/allocate-work', data);

                if (response.data.success) {
                    // Show a success message
                    toast.success('Work allocated successfully');
                    setSelectedMechanic('');
                    fetchBookings();
                    close();
                }
            } catch (error) {
                console.error('Error while allocating work: ', error);
            } finally {
                setLoading(false);
            }
        } else {
            toast.error('Select a mechanic');
        }
    }


    // Function for fetch mechanic data
    const fetchMechanics = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get(`/get-users/${role}`);
            if (response.data.success) {
                // Update Redux store with fetched data
                dispatch(setMechanicDetails({ mechanic: response.data.data }));
            }
        } catch (error) {
            console.error('Error while fetching mechanic details: ', error);
        } finally {
            setLoading(false);
        }
    }

    // Fetch mechanics
    useEffect(() => {
        fetchMechanics();
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full relative">
                <button
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                    onClick={close}
                >
                    &times;
                </button>
                <h2 className="text-xl sm:text-2xl text-center font-semibold mb-6 ">Booking Details</h2>
                <div className="mb-4">
                    <span className="font-semibold text-sm sm:text-base ">Customer:</span>
                    <span className="ml-4 text-gray-700">{booking.customerId.name}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base">Vehicle:</span>
                    <span className="ml-4 text-gray-700">{booking.vehicleId.registrationNumber}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Service Type:</span>
                    <span className="ml-4 text-gray-700">{booking.serviceType.packageName}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Booking Date:</span>
                    <span className="ml-4 text-gray-700">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-text-sm sm:text-base ">Status:</span>
                    <span
                        className={`ml-4 font-semibold ${booking.status === 'Unallocated' ? 'text-gray-500'
                            : booking.status === 'Pending' ? 'text-yellow-500'
                                : booking.status === 'Cancelled' ? 'text-red-600'
                                    : booking.status === 'Completed' ? 'text-green-600'
                                        : 'text-gray-600'
                            }`}
                    >
                        {booking.status}
                    </span>
                </div>
                <div className="mb-6">
                    <label className="font-semibold text-text-sm sm:text-base  block mb-2">Mechanic:</label>
                    <select
                        onChange={handleOnChange}
                        value={selectedMechanic}
                        className="w-full p-2 border rounded-lg text-gray-700 outline-none transition">
                        <option value="">Select mechanic</option>
                        {
                            mechanics.map((mechanic) => (
                                <option
                                    key={mechanic._id} value={mechanic._id}>{mechanic.name}</option>
                            ))
                        }
                    </select>
                </div>
                <button
                    className="w-full text-sm sm:text-base bg-purple-500 hover:bg-purple-600 text-white tracking-wider py-2 rounded-lg shadow-custom transition-transform transform hover:scale-105"
                    onClick={handleSubmit}
                >
                    Allocate
                </button>
            </div>
        </div>

    )
}

export default AllocationPopup;