import { directionSlice } from "@/entities/direction";
import { locationSlice } from "@/entities/location";
import { currencySlice } from "@/entities/currency";
import { baseApi } from "@/shared/api";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { currencyFormSlice } from "@/widgets/currencyForm";
import { exchangerSlice } from "@/entities/exchanger";
import { userSlice } from "@/entities/user";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["direction", "location", "currency"],
};

const rootReducer = combineReducers({
  [locationSlice.name]: locationSlice.reducer,
  [directionSlice.name]: directionSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [currencyFormSlice.name]: currencyFormSlice.reducer,
  [currencySlice.name]: currencySlice.reducer,
  [exchangerSlice.name]: exchangerSlice.reducer,
  [userSlice.name]: userSlice.reducer,
});

export const setupStore = () => {
  const store = configureStore({
    reducer: persistReducer(
      persistConfig,
      rootReducer
    ) as unknown as typeof rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware),
  });
  setupListeners(store.dispatch);
  return store;
};
export const appStore = setupStore();
export const persistedStore = persistStore(appStore);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof appStore.dispatch;
