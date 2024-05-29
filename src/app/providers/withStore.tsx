import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { appStore, persistedStore } from "./storeProvider";

export const withStore = (Component: React.FC) => {
  return () => (
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistedStore}>
        <Component />
      </PersistGate>
    </Provider>
  );
};
