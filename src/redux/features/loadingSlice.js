import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: 'loading',
    initialState: true,
    reducers: {
        // Reducer to set the loading state
        setLoading(state, action) {
            // Directly update the state with the payload from the action
            return action.payload;
        }
    }
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;