import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import userSlice from "./userSlice";
import cardSlice from "./cardSlice";
import themeSlice from "./themeSlice";
import middleSlice from "./middleSlice";
import storage from "redux-persist/lib/storage";
import toastSlice from "./toastSlice";
import audioSlice from "./audioSlice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["middle"],
};

const rootReducer = combineReducers({
  user: userSlice,
  card: cardSlice,
  theme: themeSlice,
  middle: middleSlice,
  toast: toastSlice,
  audio: audioSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
