import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const CustomerVehicleDetails = () => {
    // Extract the vehicle id from the URL parameter
    const { vehicleId } = useParams();
    // Access the customer vehicle data from the redux store
    const customerVehicles = useSelector((state) => state.customerVehicle.customerVehicle);

    // Function to format the date using moment 
    const formatDate = (dateString) => {
        return moment(dateString).format('DD MMM YYYY');
    };

    // Determine the vehicle to display
    let vehicle;

    if (vehicleId) {
        // Find the vehicle by id
        vehicle = customerVehicles.find((vehicle) => vehicle._id === vehicleId);
    }

    if (!vehicle && customerVehicles.length > 0) {
        // If id is not found or not provided, default to the first vehicle
        vehicle = customerVehicles[0];
    }

    // If no vehicle data is available display a message
    if (!vehicle) {
        return <div className='p-5'>No vehicles available</div>;
    }


    return (
        <div>
            <div className='flex flex-col p-5 gap-5'>
                <h1 className='text-2xl font-semibold mb-4'>Vehicle Details</h1>
                <div>
                    <h1 className='text-sm text-gray-400'>Registration Number</h1>
                    <div className='text-xl font-semibold'>{vehicle.registrationNumber}</div>
                </div>

                <div>
                    <h1 className='text-sm text-gray-400'>Model</h1>
                    <div className='text-xl font-semibold'>{vehicle.modelName.name}</div>
                </div>

                <div>
                    <h1 className='text-sm text-gray-400'>Registration Date</h1>
                    <div className='text-xl font-semibold'>{formatDate(vehicle.registrationDate)}</div>
                </div>

                <div>
                    <h1 className='text-sm text-gray-400'>Free Service</h1>
                    <div className='text-xl font-semibold'>{vehicle.freeServiceEligibility ? 'Available' : 'Not Available'}</div>
                </div>

                {/* Show the count of the available free service if eligibility is true */}
                { vehicle.freeServiceEligibility &&
                    <div>
                    <h1 className='text-sm'>Available Free Services</h1>
                    <div className='text-xl font-semibold'>{3 - vehicle.freeServiceCount}</div>
                </div>}
            </div>
        </div>
    )
}

export default CustomerVehicleDetails