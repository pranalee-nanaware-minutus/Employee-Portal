import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login/Login"
import Signup from "../pages/Signup/Signup"
import Dashboard from "../pages/Dashboard/Dashboard"
import Employees from "../pages/Employees/Employees"
import AddEmployee from "../pages/Employees/AddEmployee"
import EditEmployee from "../pages/Employees/EditEmployee"
import Departments from "../pages/Departments/Departments"
import NotFound from "../pages/NotFound/NotFound"
import MainLayout from "../layouts/MainLayout"
import ProtectedRoute from "./ProtectedRoute"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/add"
            element={
              <ProtectedRoute>
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/edit/:id"
            element={
              <ProtectedRoute>
                <EditEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <Departments />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
