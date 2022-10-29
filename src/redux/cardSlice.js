import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
    name: "card",
    initialState: {
        list: {},
        index: 1
    },
    reducers: {
        add: (state, actions) => {
            state.list = actions.payload
        },
        updateIndex: (state, actions) => {
            state.index = actions.payload
        }
    }
})
export const { add, updateIndex } = cardSlice.actions
export default cardSlice.reducer