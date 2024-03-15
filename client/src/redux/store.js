import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({ user: userReducer });

const persistStorage = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistStorage, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false });
  },
});

export const persistor = persistStore(store);