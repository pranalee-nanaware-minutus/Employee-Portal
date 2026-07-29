import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material"
import { 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon 
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useThemeStore } from "../../stores/themeStore"
import { authService } from "../../services/authService"

function Navbar() {
  const navigate = useNavigate()
  const { mode, toggleTheme } = useThemeStore()

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Employee Portal
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" onClick={toggleTheme} title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
