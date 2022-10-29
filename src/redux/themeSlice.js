import { createSlice } from "@reduxjs/toolkit";


const themeSlice = createSlice({
    name: "theme",
    initialState: {
        theme: 'light'
    },
    reducers: {
        toggle: (state, action) => {
            state.theme = action.payload
        }
    }
})


export const { toggle } = themeSlice.actions
export default themeSlice.reducer