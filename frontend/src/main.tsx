import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { Toaster } from "react-hot-toast"
import { lightTheme, darkTheme } from "./theme/theme.tsx"
import { useThemeStore } from "./stores/themeStore"

function ThemedApp() {
  const mode = useThemeStore((state) => state.mode)
  const theme = mode === "dark" ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <App />
    </ThemeProvider>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemedApp />
  </StrictMode>,
)
