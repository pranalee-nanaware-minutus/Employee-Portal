import { useState, useEffect } from "react"
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider
} from "@mui/material"
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Work as WorkIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from "@mui/icons-material"
import { useAuthStore } from "../../stores/authStore"
import { api } from "../../services/axios"
import { employeeService } from "../../services/employeeService"
import type { Employee } from "../../types/employee"

interface Stats {
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
  totalDepartments: number
  totalUsers: number
  allEmployees: Employee[]
}

function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalDepartments: 0,
    totalUsers: 0,
    allEmployees: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch employees
        const employeesRes = await api.get('/employees')
        const employees = Array.isArray(employeesRes.data) ? employeesRes.data : []
        
        // Calculate employee stats
        const activeEmployees = employees.filter((emp: Employee) => emp.status === 'active').length
        const inactiveEmployees = employees.filter((emp: Employee) => emp.status === 'inactive').length
        
        // Get unique departments
        const departments = [...new Set(employees.map((emp: Employee) => emp.department))]

        // Get all employees sorted by ID (newest first)
        const allEmployees = employees
          .sort((a: Employee, b: Employee) => b.id - a.id)

        setStats({
          totalEmployees: employees.length,
          activeEmployees,
          inactiveEmployees,
          totalDepartments: departments.length,
          totalUsers: 0, // Users endpoint not available
          allEmployees
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({ 
    title, 
    value, 
    color, 
    icon: Icon,
    subtitle 
  }: { 
    title: string; 
    value: number; 
    color: string;
    icon: any;
    subtitle?: string;
  }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: color,
              mr: 2,
              width: 48,
              height: 48
            }}
          >
            <Icon />
          </Avatar>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color }}>
              {loading ? '...' : value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name || 'User'}! Here's your employee portal overview.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            color="#1976d2"
            icon={PeopleIcon}
            subtitle={`${stats.activeEmployees} active`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active"
            value={stats.activeEmployees}
            color="#2e7d32"
            icon={ActiveIcon}
            subtitle={`${Math.round((stats.activeEmployees / (stats.totalEmployees || 1)) * 100)}% of total`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Departments"
            value={stats.totalDepartments}
            color="#ed6c02"
            icon={BusinessIcon}
            subtitle="Across company"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            color="#9c27b0"
            icon={PersonIcon}
            subtitle="Registered accounts"
          />
        </Grid>
      </Grid>

      {/* Employee Status Visualization */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Employee Status Overview
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {/* Active Employees */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'success.main',
                    margin: '0 auto 2',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {stats.activeEmployees}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600, color: 'success.main' }}>
                  Active Employees
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {Math.round((stats.activeEmployees / (stats.totalEmployees || 1)) * 100)}% of total workforce
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.activeEmployees / (stats.totalEmployees || 1)) * 100}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: 'grey.200',
                    mt: 2,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#2e7d32'
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* Visual Divider */}
            <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ 
                width: 1, 
                height: '100%', 
                bgcolor: 'divider',
                display: { xs: 'none', md: 'block' }
              }} />
            </Grid>

            {/* Inactive Employees */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'error.main',
                    margin: '0 auto 2',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {stats.inactiveEmployees}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600, color: 'error.main' }}>
                  Inactive Employees
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {Math.round((stats.inactiveEmployees / (stats.totalEmployees || 1)) * 100)}% of total workforce
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.inactiveEmployees / (stats.totalEmployees || 1)) * 100}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: 'grey.200',
                    mt: 2,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#d32f2f'
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Department Breakdown */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Department Breakdown
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[...new Set(stats.allEmployees.map((emp: Employee) => emp.department))].map((dept) => {
              const deptCount = stats.allEmployees.filter((emp: Employee) => emp.department === dept).length
              const deptActive = stats.allEmployees.filter((emp: Employee) => emp.department === dept && emp.status === 'active').length
              const percentage = (deptCount / stats.totalEmployees) * 100
              
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={dept}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {dept}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {deptCount}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#1976d2'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {deptActive} active • {percentage.toFixed(0)}% of total
                    </Typography>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* All Employees Overview */}
      <Card>
      <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              All Employees Overview
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {stats.allEmployees.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Salary</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.allEmployees.map((employee, index) => (
                    <TableRow 
                      key={employee.id} 
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        bgcolor: index % 2 === 0 ? 'transparent' : 'grey.50'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, width: 36, height: 36, bgcolor: 'primary.main' }}>
                            {employee.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {employee.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {employee.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={employee.department} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        ${employee.salary.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(employee.joinDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          icon={employee.status === 'active' ? <ActiveIcon /> : <InactiveIcon />}
                          label={employee.status}
                          color={employee.status === 'active' ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No employees added yet
              </Typography>
            </Box>
          )}
          {stats.allEmployees.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Showing all {stats.allEmployees.length} employees
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* User Profile Card */}
      <Card sx={{ mt: 3 }}>
      <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Your Profile
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Name:</strong> {user?.name}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {user?.email}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Role:</strong> <Chip label={user?.role} size="small" color="primary" />
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>User ID:</strong> {user?.id}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard
