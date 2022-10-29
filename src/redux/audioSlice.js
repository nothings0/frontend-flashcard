import { createSlice } from "@reduxjs/toolkit";

const audioSlice = createSlice({
    name: "audio",
    initialState: {
        currentTime: 0,
        isPlay: false,
        check: true
    },
    reducers: {
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload
        },
        setIsPlay: (state, action) => {
            state.isPlay = action.payload
        },
        setCheck: (state, action) => {
            state.check = action.payload
        }
    }
})


export const { setCurrentTime, setIsPlay, setCheck } = audioSlice.actions
export default audioSlice.reducer