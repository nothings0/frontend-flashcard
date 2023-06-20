import { createSlice } from "@reduxjs/toolkit";

const audioSlice = createSlice({
  name: "audio",
  initialState: {
    isPlay: false,
  },
  reducers: {
    play: (state) => {
      state.isPlay = true;
    },
    pause: (state, _) => {
      state.isPlay = false;
    },
  },
});

export const { play, pause } = audioSlice.actions;
export default audioSlice.reducer;
