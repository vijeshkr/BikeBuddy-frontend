import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import loadingReducer from '../features/loadingSlice';
import sideBarOpenClose from '../features/sideBarOpenClose';
import customerVehicleReducer from '../features/customerVehicleSlice';
import customerReducer from '../features/customersSlice';
import mechanicReducer from '../features/mechanicSlice';
import leaveReducer from '../features/leavesSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        sidebar: sideBarOpenClose,
        customerVehicle: customerVehicleReducer,
        customer:customerReducer,
        mechanic:mechanicReducer,
        leaves:leaveReducer,
    }
});

export default store;