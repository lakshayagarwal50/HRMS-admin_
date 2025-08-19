// src/main.tsx

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { BrowserRouter } from "react-router-dom";
import { setupAxiosInterceptors } from "./services/index.ts";
import { checkAuthStatus } from "./features/auth/authSlice.ts";

// Setup Axios interceptors
setupAxiosInterceptors(store);

// Perform initial check for authentication status
store.dispatch(checkAuthStatus());

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);