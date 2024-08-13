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
    }
});

export const { customerVehicleDetails } = customerVehicleSlice.actions;
export default customerVehicleSlice.reducer;