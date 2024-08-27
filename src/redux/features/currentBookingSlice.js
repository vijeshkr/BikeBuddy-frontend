import { createSlice } from "@reduxjs/toolkit";

const currentBookingSlice = createSlice({
    name: 'currentBookings',
    initialState: {
        currentBookings: []
    },

    reducers: {
        // Add new booking to the existing array
        addNewBooking(state, action) {
            state.currentBookings = [action.payload, ...state.currentBookings];
        },
        // Replace the entire booking array with a new one
        setCurrentBookings(state, action) {
            state.currentBookings = action.payload.currentBookings;
        },
    }
});

export const { addNewBooking, setCurrentBookings } = currentBookingSlice.actions;
export default currentBookingSlice.reducer;