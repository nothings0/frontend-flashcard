import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null
    },
    reducers: {
        loginSuccess: (state, actions) => {
            if(!actions.payload || !actions.payload.accessToken) {
                return;
            }
            state.currentUser = actions.payload
            localStorage.setItem("accessToken", JSON.stringify(actions.payload.accessToken));
        },
        logoutSuccess: (state, _) => {
            state.currentUser = null
            localStorage.removeItem("accessToken");
        }
    }
})


export const {loginSuccess, logoutSuccess} = userSlice.actions
export default userSlice.reducer