import { createSlice } from "@reduxjs/toolkit";

const customerVehicleSlice = createSlice({
    name: 'customerVehicle',
    initialState: {
        customerVehicle: []
    },
    reducers: {
        // Reducer to update customer vehicle details in the state
        customerVehicleDetails(state,action){
            // Directly update the state with new vehicle details from the action payload
            state.customerVehicle = action.payload.customerVehicle;
        },
        // Action to add new customer vehicle to the array
        addCustomerVehicle(state, action) {
            state.customerVehicle.push(action.payload);
        },
        // Replace customer vehicle details
        replaceCustomerVehicle(state, action) {
            const updatedVehicle = action.payload;
            state.customerVehicle = state.customerVehicle.map(vehicle =>
                vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
            );
        }
    }
});

export const { customerVehicleDetails, addCustomerVehicle, replaceCustomerVehicle } = customerVehicleSlice.actions;
export default customerVehicleSlice.reducer;