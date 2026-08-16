import { Box, Typography } from "@mui/material"

interface AuthCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <Box
      sx={{
        background: "white",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: { xs: 3, sm: 4 },
        width: "100%",
        maxWidth: 400,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          marginBottom: 1,
          color: "#333",
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "#666",
            marginBottom: 3,
          }}
        >
          {subtitle}
        </Typography>
      )}

      {children}
    </Box>
  )
}

export default AuthCard