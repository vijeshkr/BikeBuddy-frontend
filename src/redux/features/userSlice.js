import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null
    },
    reducers: {
        userDetails(state,action){
            state.user = action.payload.user;
        },
        logout(state) {
            state.user = null;
        }
    }
});

export const { userDetails, logout } = userSlice.actions;
export default userSlice.reducer;