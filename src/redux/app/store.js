import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import loadingReducer from '../features/loadingSlice';
import sideBarOpenClose from '../features/sideBarOpenClose';
import customerVehicleReducer from '../features/customerVehicleSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        sidebar: sideBarOpenClose,
        customerVehicle: customerVehicleReducer,
    }
});

export default store;