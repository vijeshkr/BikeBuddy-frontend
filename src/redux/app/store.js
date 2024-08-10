import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import loadingReducer from '../features/loadingSlice';
import sideBarOpenClose from '../features/sideBarOpenClose';
import customerVehicleReducer from '../features/customerVehicleSlice';
import customerReducer from '../features/customersSlice';
import mechanicReducer from '../features/mechanicSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        sidebar: sideBarOpenClose,
        customerVehicle: customerVehicleReducer,
        customer:customerReducer,
        mechanic:mechanicReducer,
    }
});

export default store;