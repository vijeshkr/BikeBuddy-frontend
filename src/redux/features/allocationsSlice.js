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
        // Update extra work description and amount
        updateExtraWork(state, action) {
            const updatedAllocation = action.payload;
        
            state.allocations = state.allocations.map(allocation =>
                allocation._id === updatedAllocation._id
                    ? {
                        ...allocation, // Preserve other fields in allocation
                        extraWorkDescription: updatedAllocation.extraWorkDescription ,
                        extraWorkEstimationAmount: updatedAllocation.extraWorkEstimationAmount
                      }
                    : allocation
            );
        },
        
        // Update booking status 
        updateAllocationStatus(state, action) {
            const data = action.payload;
            state.allocations = state.allocations.map(allocation =>
                allocation.bookingId._id === data.bookingId._id
                    ? { ...allocation, bookingId: { ...allocation.bookingId, status: data.status } }  // Update the status inside bookingId
                    : allocation
            );
        },

    }
});

export const { addOneAllocation, setAllAllocations, updateAllocation, updateAllocationStatus, updateExtraWork } = allocationsSlice.actions;
export default allocationsSlice.reducer;
