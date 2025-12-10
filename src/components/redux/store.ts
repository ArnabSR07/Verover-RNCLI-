// redux/store.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import dryCleanerReducer from './dryCleanerSlice';
import unsafeStopsReducer from './unsafeStopsSlice';
import parkingReducer from './parkingSlice';
import carsReducer from '../../components/redux/carSlice';
import cartReducer from './cartSlice';
// import restaurantReducer ./userSlicece';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    user: userReducer,
    unsafeStops: unsafeStopsReducer,
    dryCleaner: dryCleanerReducer,
    parking: parkingReducer,
    cart: cartReducer,
    cars: carsReducer,
    // restaurant: restaurantReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
