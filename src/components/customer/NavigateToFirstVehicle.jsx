import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

/**
 * NavigateToFirstVehicle component
 * 
 * This component automatically redirects the user to the details page of the first vehicle
 * in their list when the component is mounted and the list of vehicle is not empty.
 * 
 * Usage:
 * - The component uses `useSelector` to get the list of vehicles from the Redux store.
 * - `useNavigate` is used to programmatically navigate to the vehicle details page.
 * 
 * Note:
 * - This component does not render anything visible on the screen.
 *  
 */

const NavigateToFirstVehicle = () => {
    const navigate = useNavigate();
    // Access the list of vehicles from the redux store
    const myVehicles = useSelector((state) => state.customerVehicle.customerVehicle);

    useEffect(() => {
        if (myVehicles.length > 0) {
            const firstVehicleId = myVehicles[0]._id;
            // Navigate to the first vehicle's details
            navigate(`/user-vehicle/my-vehicle/${firstVehicleId}`);
        }
    }, [myVehicles, navigate]);

    return <div></div>;
};

export default NavigateToFirstVehicle;
