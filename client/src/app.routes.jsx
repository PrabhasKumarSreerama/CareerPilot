import { createBrowserRouter } from "react-router";
import App from "./App";
import SignIn from "./pages/account/SignIn";
import SignUp from "./pages/account/SignUp";
import Home from "./pages/account/Home";
import ForgotPassword from "./pages/account/ForgotPassword";

export const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/sign-in",
        element: <SignIn />
    },
    {
        path: "/sign-up",
        element: <SignUp />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    }
])