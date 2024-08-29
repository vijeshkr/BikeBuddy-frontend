import { createSlice } from "@reduxjs/toolkit";

const allBookingAdminSlice = createSlice({
    name: 'allBookings',
    initialState: {
        allBookings: []
    },

    reducers: {
        // Add new booking to the existing array
        addOneBooking(state, action) {
            state.allBookings = [action.payload, ...state.allBookings];
        },
        // Replace the entire booking array with a new one
        setAllBookings(state, action) {
            state.allBookings = action.payload.allBookings;
        },
        // Update a specific booking by ID
        updateAllocation(state, action) {
            const updatedBooking = action.payload;
            state.allBookings = state.allBookings.map(booking =>
                booking._id === updatedBooking._id
                    ? { ...booking, allocation: updatedBooking.allocation, status:updatedBooking.status }
                    : booking
            );
        }
    }
});

export const { addOneBooking, setAllBookings, updateAllocation } = allBookingAdminSlice.actions;
export default allBookingAdminSlice.reducer;