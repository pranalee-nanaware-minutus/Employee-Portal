import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"  //any type of data can hold this node
import type { User, AuthContextType, LoginCredentials } from "../types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "auth_token"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      // In a real app, you would validate the token with the backend
      // For now, we'll just check if it exists
      setIsAuthenticated(true)
      setUser({
        id: "1",
        email: "user@example.com",
        name: "User",
      })
    }
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - in real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => { //gives network delay
        if (email && password) {
          const mockToken = `mock_jwt_token_${Date.now()}` //this gives you milliseconds from 1 jan 1970
          localStorage.setItem(TOKEN_KEY, mockToken)
          
          setUser({
            id: "1",
            email: email,
            name: email.split("@")[0],
          })
          setIsAuthenticated(true)
          resolve()    //tells Login component that login success
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 500)
    })
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}