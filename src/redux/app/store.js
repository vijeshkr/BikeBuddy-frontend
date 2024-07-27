import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import loadingReducer from '../features/loadingSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
    }
});

export default store;