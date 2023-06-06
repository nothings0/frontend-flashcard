import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    toast: null,
    success: false,
  },
  reducers: {
    showToast: (state, actions) => {
      state.toast = actions.payload.msg;
      state.success = actions.payload.success;
      setTimeout(() => {
        hideToast();
      }, 5000);
    },
    hideToast: (state, _) => {
      state.toast = null;
      state.success = null;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
