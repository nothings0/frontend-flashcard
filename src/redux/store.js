import {combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from 'redux-persist'
import userSlice from "./userSlice"
import cardSlice from "./cardSlice"
import themeSlice from "./themeSlice"
import audioSlice from "./audioSlice"
import middleSlice from "./middleSlice"
import storage from 'redux-persist/lib/storage'
import toastSlice from "./toastSlice"

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['middle', 'audio', 'toast']
}

const rootReducer = combineReducers(
    {
        user: userSlice,
        card: cardSlice,
        theme: themeSlice,
        audio: audioSlice,
        middle: middleSlice,
        toast: toastSlice
    }
)
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production'
})

export const persistor = persistStore(store)