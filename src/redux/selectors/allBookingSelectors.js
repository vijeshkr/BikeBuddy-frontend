import { createSelector } from '@reduxjs/toolkit';

// Select the allBookings array from the state
const selectAllBookings = (state) => state.allBookings.allBookings || [];

// Create a selector to count the number of bookings by their status, get the total count, and count breakdowns
export const selectAdminBookingStats = createSelector(
  [selectAllBookings],
  (allBookings) => {
    const stats = allBookings.reduce((counts, booking) => {
      const status = booking.status;
      counts.statusCounts[status] = (counts.statusCounts[status] || 0) + 1;

      // Count breakdowns
      if (booking.breakdown) {
        counts.breakdownTrue += 1;
      } else {
        counts.breakdownFalse += 1;
      }

      return counts;
    }, {
      statusCounts: {
        Pending: 0,
        Allocated: 0,
        Progress: 0,
        Completed: 0,
        Cancelled: 0,
        Unallocated: 0,
        Unpaid: 0,
      },
      breakdownTrue: 0,
      breakdownFalse: 0,
    });

    // Return an object with the status counts, the total number of bookings, and breakdown counts
    return {
      totalBookings: allBookings.length,
      statusCounts: stats.statusCounts,
      breakdownCounts: {
        true: stats.breakdownTrue,
        false: stats.breakdownFalse
      }
    };
  }
);
