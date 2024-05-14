import { Provider } from "react-redux";
import { setupStore } from "./storeProvider/appStore";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const store = setupStore();
const persistor = persistStore(store);

export const withStore = (Component: React.FC) => {
  return () => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component />
      </PersistGate>
    </Provider>
  );
};
