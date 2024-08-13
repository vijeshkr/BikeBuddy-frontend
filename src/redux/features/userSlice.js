import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null
    },
    reducers: {
        // Action to update the user details in the state
        userDetails(state,action){
            state.user = action.payload.user;
        },
        // Action to clear the user details
        logout(state) {
            // Set user details null on logout
            state.user = null;
        }
    }
});

export const { userDetails, logout } = userSlice.actions;
export default userSlice.reducer;