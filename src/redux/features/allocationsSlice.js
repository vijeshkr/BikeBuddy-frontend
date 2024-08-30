import { createSlice } from "@reduxjs/toolkit";

const allocationsSlice = createSlice({
    name: 'allocations',
    initialState: {
        allocations: []
    },

    reducers: {
        // Add a new allocation to the existing array
        addOneAllocation(state, action) {
            state.allocations = [action.payload, ...state.allocations];
        },
        // Replace the entire allocation array with a new one
        setAllAllocations(state, action) {
            state.allocations = action.payload.allocations;
        },
        // Update a specific allocation by ID
        updateAllocation(state, action) {
            const updatedAllocation = action.payload;
            state.allocations = state.allocations.map(allocation =>
                allocation._id === updatedAllocation._id
                    ? { ...allocation, ...updatedAllocation }  // Update the allocation with new data
                    : allocation
            );
        },
        
    }
});

export const { addOneAllocation, setAllAllocations, updateAllocation } = allocationsSlice.actions;
export default allocationsSlice.reducer;
