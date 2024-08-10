import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
    name: 'customer',
    initialState: {
        customer: []
    },
    reducers: {
        addCustomer(state, action) {
            state.customer.push(action.payload);
        },
        // Replace the entire customer array with a new one
        setCustomerDetails(state, action) {
            state.customer = action.payload.customer;
        },
    }
});

export const { setCustomerDetails, addCustomer } = customerSlice.actions;
export default customerSlice.reducer;