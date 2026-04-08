import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
//i want to wrap with the provider here so that the store is available to the entire app
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { AppLayout, AuthLayout,Login, SignUp } from "./components/index.js";
import store from "./store/store";

// Temporary dummy components for routing demonstration
const Home = () => <h1 className="text-2xl font-bold">Home Page Feed</h1>;

const Dashboard = () => (
  <h1 className="text-2xl font-bold">Creator Dashboard</h1>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // The main layout wraps all pages
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignUp />
          </AuthLayout>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
 
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  
);
