/* persist our store */
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import userDataSlice from './userData/userDataSlice';
import userStoreSlice from './apis/userApi/userStoreSlice';
import roomStoreSlice from './apis/roomApi/roomStoreSlice';
import hostelStoreSlice from './apis/hostelApi/hostelStoreSlice';
import reservationStoreSlice from './apis/reservationApi/reservationStoreSlice';

import otpApi from './apis/otpApi';
import entryApi from './apis/entryApi';
import emailApi from './apis/emailApi';
import ratingApi from './apis/ratingApi';
import userStoreApi from './apis/userApi/userStoreApi';
import roomStoreApi from './apis/roomApi/roomStoreApi';
import hostelStoreApi from './apis/hostelApi/hostelStoreApi';
import reservationStoreApi from './apis/reservationApi/reservationStoreApi';

/* reducers */
const reducer = combineReducers({
  userData: userDataSlice,
  userStore: userStoreSlice,
  roomStore: roomStoreSlice,
  hostelStore: hostelStoreSlice,
  reservationStore: reservationStoreSlice,
  [otpApi.reducerPath]: otpApi.reducer,
  [entryApi.reducerPath]: entryApi.reducer,
  [emailApi.reducerPath]: emailApi.reducer,
  [ratingApi.reducerPath]: ratingApi.reducer,
  [roomStoreApi.reducerPath]: roomStoreApi.reducer,
  [userStoreApi.reducerPath]: userStoreApi.reducer,
  [hostelStoreApi.reducerPath]: hostelStoreApi.reducer,
  [reservationStoreApi.reducerPath]: reservationStoreApi.reducer
});

const persistConfig = {
  storage,
  key: 'root',
  blackList: [
    otpApi.reducerPath,
    emailApi.reducerPath,
    entryApi.reducerPath,
    ratingApi.reducerPath,
    userStoreApi.reducerPath,
    roomStoreApi.reducerPath,
    hostelStoreApi.reducerPath,
    reservationStoreApi.reducerPath
  ]
};

/* persist our store */
const persistedReducer = persistReducer(persistConfig, reducer);

/* creating our store */
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(
      otpApi.middleware,
      entryApi.middleware,
      emailApi.middleware,
      ratingApi.middleware,
      roomStoreApi.middleware,
      userStoreApi.middleware,
      hostelStoreApi.middleware,
      reservationStoreApi.middleware
    )
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
