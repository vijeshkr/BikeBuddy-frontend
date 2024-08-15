import { createSlice } from "@reduxjs/toolkit";

const leavesSlice = createSlice({
    name: 'leaves',
    initialState: {
        leaves: []
    },

    reducers: {
        // Add new leave to the existing array
        addLeave(state, action) {
            state.leaves.push(action.payload);
        },
        // Replace the entire leaves array with a new one
        setLeaves(state, action) {
            state.leaves = action.payload.leaves;
        },
        // Update a specific leave by ID
        updateLeaveStatus(state, action) {
            const updatedLeave = action.payload;
            state.leaves = state.leaves.map(leave =>
                leave._id === updatedLeave._id ? updatedLeave : leave
            );
        }
    }
});

export const { setLeaves, addLeave, updateLeaveStatus } = leavesSlice.actions;
export default leavesSlice.reducer;