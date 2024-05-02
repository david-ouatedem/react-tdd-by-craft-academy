import {createBrowserRouter, Navigate} from "react-router-dom";
import { Home } from "./pages/home/Home";
import { ProtectedPageLayout } from "./pages/ProtectedPageLayout.tsx";
import { createHomeLoader } from "./pages/home/create-home-loader";
import { AppStore } from "./lib/create-store";
import {Login} from "@/pages/login/Login.tsx";

export const createRouter = ({store}: {store: AppStore}, createRouterFn = createBrowserRouter) => createRouterFn([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedPageLayout />,
    children: [
      {
        index: true,
        path: "home",
        loader: createHomeLoader({store}),
        element: <Home />,
      },
      {
        path: "",
        element: <Navigate to={"/home"}/>,
      },
    ],
  },
]);

export type AppRouter = ReturnType<typeof createRouter>