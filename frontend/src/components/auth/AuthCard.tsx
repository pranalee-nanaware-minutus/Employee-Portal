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
        borderRadius: 4,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        padding: { xs: 3, sm: 4, md: 5 },
        width: "100%",
      }}
    >
      {/* Logo/Icon */}
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 3",
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        EP
      </Box>

      {/* Title */}
      <Typography
        variant="h3"
        component="h1"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          marginBottom: 1,
          color: "#1a1a1a",
          fontSize: { xs: "1.75rem", sm: "2rem" },
        }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "#666",
            marginBottom: 4,
            fontSize: "0.95rem",
          }}
        >
          {subtitle}
        </Typography>
      )}

      {/* Form Content */}
      {children}
    </Box>
  )
}

export default AuthCard