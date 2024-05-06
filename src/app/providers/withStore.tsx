import { Provider } from "react-redux";
import { setupStore } from "./storeProvider/appStore";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/legacy/api/queryClient";

const store = setupStore();
// const persistor = persistStore(store);

export const withStore = (Component: React.FC) => {
  return () => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <Component />
        {/* </PersistGate> */}
      </Provider>
    </QueryClientProvider>
  );
};
