import { useState, useEffect } from "react"
import {
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Paper,
  Divider,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast'
import { employeeService } from "../../services/employeeService"
import type { CreateEmployeeData } from "../../types/employee"

function AddEmployee() {
  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: 0,
    joinDate: new Date().toISOString().split('T')[0],
    status: "active"
  })
  const [salaryInput, setSalaryInput] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'salary') {
      setSalaryInput(value)
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Initialize salary input when form loads
  useEffect(() => {
    if (formData.salary > 0) {
      setSalaryInput(formData.salary.toString())
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await employeeService.createEmployee(formData)
      toast.success('Employee created successfully!')
      navigate("/employees")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error creating employee"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Add New Employee
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill in the details below to add a new employee to the system
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          maxWidth: 800,
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                placeholder="Enter employee's full name"
                helperText="First and last name"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                placeholder="example@company.com"
                helperText="Company email address"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  label="Department"
                  onChange={(e) => handleChange(e as any)}
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                fullWidth
                placeholder="e.g. Software Engineer"
                helperText="Job title or position"
              />
            </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Salary"
                name="salary"
                type="text"
                value={salaryInput}
                onChange={handleChange}
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                placeholder="50000"
                helperText="Annual salary in USD"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Join Date"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                helperText="Date of joining"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleChange(e as any)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/employees")}
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                >
                  {loading ? "Creating..." : "Create Employee"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default AddEmployee
