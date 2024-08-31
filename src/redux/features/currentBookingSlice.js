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
        // Update a specific booking by ID
        updateBookingStatus(state, action) {
            const updatedBooking = action.payload;
            state.currentBookings = state.currentBookings.map(booking =>
                booking._id === updatedBooking._id
                    ? { ...booking, status: updatedBooking.status }
                    : booking
            );
        },

        // Update customer approval
        updateCustomerApproval(state, action) {
            const updatedAllocation = action.payload;

            state.currentBookings = state.currentBookings.map(booking =>
                booking._id === updatedAllocation.bookingId
                    ? {
                        ...booking, // Preserve other fields in allocation
                        allocation: {
                            ...booking.allocation, // Preserve other fields in allocation
                            customerApproval: updatedAllocation.customerApproval
                        }
                    }
                    : booking
            );
        },
    }
});

export const { addNewBooking, setCurrentBookings, updateBookingStatus, updateCustomerApproval } = currentBookingSlice.actions;
export default currentBookingSlice.reducer;