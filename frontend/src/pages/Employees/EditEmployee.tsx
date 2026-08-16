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
  Paper,
  Divider,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { employeeService } from "../../services/employeeService"
import { employeeSchema, type EmployeeFormData } from "../../schemas/employeeSchema"
import type { UpdateEmployeeData } from "../../types/employee"

const DEPARTMENTS = [
  "Engineering",
  "HR",
  "Marketing",
  "Finance",
  "Sales",
  "Operations",
]

const EditEmployee = () => {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  })

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (!id) return
        const employee = await employeeService.getEmployeeById(Number(id))
        setValue("name", employee.name)
        setValue("email", employee.email)
        setValue("department", employee.department)
        setValue("position", employee.position)
        setValue("salary", employee.salary.toString())
        setValue("joinDate", employee.joinDate)
        setValue("status", employee.status)
      } catch (error) {
        console.error("Error fetching employee:", error)
        toast.error("Error loading employee data")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [id, setValue])

  const onSubmit = async (data: EmployeeFormData) => {
    setSubmitting(true)
    try {
      if (!id) return
      const updateData: UpdateEmployeeData = {
        id: Number(id),
        name: data.name,
        email: data.email,
        department: data.department,
        position: data.position,
        salary: Number(data.salary),
        joinDate: data.joinDate,
        status: data.status,
      }
      await employeeService.updateEmployee(Number(id), updateData)
      toast.success("Employee updated successfully!")
      navigate("/employees")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error updating employee")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Edit Employee
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update employee information and details
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          maxWidth: 800,
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Full Name"
                fullWidth
                placeholder="Enter employee's full name"
                helperText="First and last name"
                error={!!errors.name}
                {...register("name")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                placeholder="example@company.com"
                helperText="Company email address"
                error={!!errors.email}
                {...register("email")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  {...register("department")}
                >
                  {DEPARTMENTS.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Position"
                fullWidth
                placeholder="e.g. Software Engineer"
                helperText="Job title or position"
                error={!!errors.position}
                {...register("position")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Salary"
                type="text"
                fullWidth
                placeholder="50000"
                helperText="Annual salary in USD"
                error={!!errors.salary}
                {...register("salary")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Join Date"
                type="date"
                fullWidth
                helperText="Date of joining"
                error={!!errors.joinDate}
                {...register("joinDate")}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select label="Status" {...register("status")}>
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
                  disabled={submitting}
                  size="large"
                >
                  {submitting ? "Updating..." : "Update Employee"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default EditEmployee
