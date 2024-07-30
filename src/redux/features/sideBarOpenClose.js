import { createSlice } from "@reduxjs/toolkit";

const sideBarOpenClose = createSlice({
    name: 'sidebar',
    initialState: true,
    reducers: {
        setOpenSideBar(state, action) {
            return action.payload;
        }
    }
});

export const { setOpenSideBar } = sideBarOpenClose.actions;
export default sideBarOpenClose.reducer;