import { createSlice } from "@reduxjs/toolkit";

const leavesSlice = createSlice({
    name: 'leaves',
    initialState: {
        leaves: []
    },

    reducers: {
        // Add new leave to the existing array
        addLeave(state, action){
            state.leaves.push(action.payload);
        },
        // Replace the entire leaves array with a new one
        setLeaves(state, action) {
            state.leaves = action.payload.leaves;
        }
    }
});

export const { setLeaves, addLeave } = leavesSlice.actions;
export default leavesSlice.reducer;