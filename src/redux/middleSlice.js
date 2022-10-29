import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        loading: false
    },
    reducers: {
        handleLoading: (state) => {
            state.loading = true
        },
        handleRemove: (state, _) => {
            state.loading = false
        }
    }
})


export const { handleLoading, handleRemove } = loadingSlice.actions
export default loadingSlice.reducer