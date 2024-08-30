import { createSelector } from '@reduxjs/toolkit';

// Select the allocations array from the state
const selectAllAllocations = (state) => state.allocations.allocations || [];

// Create a selector to count the number of allocations by their status, get the total count
export const selectAllocationStats = createSelector(
  [selectAllAllocations],
  (allocations) => {
    const stats = allocations.reduce((counts, allocation) => {
      const status = allocation.bookingId.status;  // Assuming each allocation has a status

      // Count by status
      counts.statusCounts[status] = (counts.statusCounts[status] || 0) + 1;

      return counts;
    }, {
      statusCounts: {
        Pending: 0,
        Allocated: 0,
        Progress: 0,
        Completed: 0,
        Cancelled: 0,
        Unallocated: 0,
      },
    });

    // Return an object with the status counts, total allocations, and allocation counts by mechanic
    return {
      totalAllocations: allocations.length,
      statusCounts: stats.statusCounts,
    };
  }
);
