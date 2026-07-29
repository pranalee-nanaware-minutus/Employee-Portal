import { useState } from "react"
import { TextField, Button, Box, Link } from "@mui/material"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import AuthLayout from "../../components/auth/AuthLayout"
import AuthCard from "../../components/auth/AuthCard"
import { authService } from "../../services/authService"
import { signupSchema, type SignupFormData } from "../../schemas/authSchema"

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true)
    try {
      await authService.signup({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      toast.success("Account created successfully! Please login.")
      navigate("/login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error creating account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard title="Sign Up" subtitle="Create your account">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Full Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name")}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message || "At least 6 characters"}
            {...register("password")}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ mt: 1 }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Login
            </Link>
          </Box>
        </Box>
      </AuthCard>
    </AuthLayout>
  )
}

export default Signup
