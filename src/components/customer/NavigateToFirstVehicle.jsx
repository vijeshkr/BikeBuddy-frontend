import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NavigateToFirstVehicle = () => {
    const navigate = useNavigate();
    const myVehicles = useSelector((state) => state.customerVehicle.customerVehicle);

    useEffect(() => {
        if (myVehicles.length > 0) {
            const firstVehicleId = myVehicles[0]._id;
            // Navigate to the first vehicle's details only if there's no current vehicleId
            navigate(`/user-vehicle/my-vehicle/${firstVehicleId}`);
        }
    }, [myVehicles, navigate]);

    return <div></div>;
};

export default NavigateToFirstVehicle;
