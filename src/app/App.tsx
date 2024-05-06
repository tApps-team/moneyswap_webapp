import { FC, ReactElement } from "react";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../legacy/api/queryClient";
import { Provider } from "react-redux";
import { setupStore } from "./providers/storeProvider";
import { MainPage } from "@/pages/main";
const store = setupStore();
const App: FC = (): ReactElement => {
  return (
    <div className="main__wrapper">
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MainPage />
        </Provider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
