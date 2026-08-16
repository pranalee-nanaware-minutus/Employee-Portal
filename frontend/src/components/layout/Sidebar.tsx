import { Drawer, List, ListItem, ListItemButton, ListItemText, Box } from "@mui/material"
import { Link as RouterLink, useLocation } from "react-router-dom"

const drawerWidth = 240

const menuItems = [
  { text: "Dashboard", path: "/dashboard" },
  { text: "Employees", path: "/employees" },
  { text: "Departments", path: "/departments" },
]

function Sidebar() {
  const location = useLocation()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          marginTop: "64px",
        },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar