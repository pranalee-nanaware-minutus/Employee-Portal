import { useEffect } from "react"
import AppRoutes from "./routes/AppRoutes"
import { useAuthStore } from "./stores/authStore"
import { authService } from "./services/authService"

function App() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    // Validate token on app startup
    const initAuth = async () => {
      if (token) {
        const isValid = await authService.validateToken()
        if (isValid) {
          // Token is valid, user is already set in store
          console.log("User authenticated via token")
        }
      }
    }

    initAuth()
  }, [token, setAuth])

  return <AppRoutes />
}

export default App
