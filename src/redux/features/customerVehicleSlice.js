import { createSlice } from "@reduxjs/toolkit";

const customerVehicleSlice = createSlice({
    name: 'customerVehicle',
    initialState: {
        customerVehicle: []
    },
    reducers: {
        customerVehicleDetails(state,action){
            state.customerVehicle = action.payload.customerVehicle;
        },
    }
});

export const { customerVehicleDetails } = customerVehicleSlice.actions;
export default customerVehicleSlice.reducer;