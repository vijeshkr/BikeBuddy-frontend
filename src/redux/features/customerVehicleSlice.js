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
    }
});

export const { customerVehicleDetails, addCustomerVehicle } = customerVehicleSlice.actions;
export default customerVehicleSlice.reducer;