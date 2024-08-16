import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import loadingReducer from '../features/loadingSlice';
import sideBarOpenClose from '../features/sideBarOpenClose';
import customerVehicleReducer from '../features/customerVehicleSlice';
import customerReducer from '../features/customersSlice';
import mechanicReducer from '../features/mechanicSlice';
import leaveReducer from '../features/leavesSlice';
import notificationReducer from '../features/notificationSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        sidebar: sideBarOpenClose,
        customerVehicle: customerVehicleReducer,
        customer:customerReducer,
        mechanic:mechanicReducer,
        leaves:leaveReducer,
        notifications:notificationReducer,
    }
});

export default store;