import { Box, Toolbar } from "@mui/material"
import { Outlet } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Sidebar from "../components/layout/Sidebar"

function MainLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "64px",
        }}
      >
            {/* materil UI component */}
        <Toolbar /> 
    
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout