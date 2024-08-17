import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
    },
    reducers: {
        // Replace entire array with new one
        allNotifications(state, action) {
            state.notifications = action.payload,
                state.unreadCount = action.payload.filter(notification => !notification.read).length;
        },
        // Mark as read
        markAsRead(state, action) {
            const notificationId = action.payload;
            state.notifications = state.notifications.map(notification =>
                notification._id === notificationId
                    ? { ...notification, read: true }
                    : notification
            );
            state.unreadCount = state.notifications.filter(n => !n.read).length;
        },
        // Mark all as read
        markAllAsRead(state) {
            state.notifications = state.notifications.map(notification => ({
                ...notification,
                read: true
            }));
            state.unreadCount = 0;
        },
        // Add new notification
        addNotification(state, action) {
            // Add the new notification to the front of the array
            state.notifications = [action.payload, ...state.notifications];
            state.unreadCount += 1;
        },
    }
});

export const { allNotifications, markAsRead, markAllAsRead, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;