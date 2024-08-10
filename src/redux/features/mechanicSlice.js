import { createSlice } from "@reduxjs/toolkit";

const mechanicSlice = createSlice({
    name: 'mechanic',
    initialState: {
        mechanic: []
    },
    reducers: {
        addMechanic(state, action) {
            state.mechanic.push(action.payload);
        },
        // Replace the entire mechanic array with a new one
        setMechanicDetails(state, action) {
            state.mechanic = action.payload.mechanic;
        },
    }
});

export const { setMechanicDetails, addMechanic } = mechanicSlice.actions;
export default mechanicSlice.reducer;