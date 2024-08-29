import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import loadingReducer from '../features/loadingSlice';
import sideBarOpenClose from '../features/sideBarOpenClose';
import customerVehicleReducer from '../features/customerVehicleSlice';
import customerReducer from '../features/customersSlice';
import mechanicReducer from '../features/mechanicSlice';
import leaveReducer from '../features/leavesSlice';
import notificationReducer from '../features/notificationSlice';
import currentBookingReducer from '../features/currentBookingSlice';
import allBookingAdminReducer from '../features/allBookingAdminSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        sidebar: sideBarOpenClose,
        customerVehicle: customerVehicleReducer,
        customer: customerReducer,
        mechanic: mechanicReducer,
        leaves: leaveReducer,
        notifications: notificationReducer,
        currentBookings: currentBookingReducer,
        allBookings: allBookingAdminReducer,
    }
});

export default store;