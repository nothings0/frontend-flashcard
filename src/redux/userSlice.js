import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null
    },
    reducers: {
        loginSuccess: (state, actions) => {
            state.currentUser = actions.payload
        },
        logoutSuccess: (state, _) => {
            state.currentUser = null
        }
    }
})


export const {loginSuccess, logoutSuccess} = userSlice.actions
export default userSlice.reducer