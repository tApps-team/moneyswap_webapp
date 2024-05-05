import { baseApi } from "@/shared/api";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});
export const setupStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
  setupListeners(store.dispatch);
  return store;
};
export const appStore = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof appStore.dispatch;
