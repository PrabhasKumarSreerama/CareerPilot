import { RouterProvider } from "react-router"
import {appRoutes} from "./app.routes.jsx"
import { AuthProvider } from "./context/auth.context.jsx"

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={appRoutes} />
    </AuthProvider>
  )
}

export default App
