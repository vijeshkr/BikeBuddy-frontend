import { createSlice } from "@reduxjs/toolkit";

const sideBarOpenClose = createSlice({
    name: 'sidebar',
    initialState: true,
    reducers: {
        // Action to set the side bar open close state
        setOpenSideBar(state, action) {
            return action.payload;
        }
    }
});

export const { setOpenSideBar } = sideBarOpenClose.actions;
export default sideBarOpenClose.reducer;