// src/App.tsx
import { Provider } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
  // return (
  //   <h1 className='text-2xl'>App</h1>
  // )
}

export default App;
