const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const SECRET_KEY = 'your-secret-key-change-this-in-production'

// Database initialization (moved from server.js)
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const path = require('path')
const adapter = new JSONFile(path.join(__dirname, 'db.json'))
const db = new Low(adapter, {
  users: [],
  employees: []
})

module.exports = (router) => {
  
  // Signup endpoint
  router.post('/signup', async (req, res) => {
    try {
      const { email, password, name } = req.body
      
      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields are required' })
      }
      
      // Check if user already exists
      await db.read()
      const existingUser = db.data.users.find((user) => user.email === email)
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' })
      }
      
      // Hash the password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      
      // Create new user
      const newUser = {
        id: Date.now(),
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: 'user'
      }
      
      // Save to database
      db.data.users.push(newUser)
      await db.write()
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        SECRET_KEY,
        { expiresIn: '24h' }
      )
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser
      
      res.status(201).json({
        message: 'User created successfully',
        token,
        user: userWithoutPassword
      })
      
    } catch (error) {
      console.error('Signup error:', error)
      res.status(500).json({ error: 'Error creating user' })
    }
  })
  
  // Login endpoint
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }
      
      // Find user by email
      await db.read()
      const user = db.data.users.find((u) => u.email === email.toLowerCase())
      
      // ⚠️  LEARNING PURPOSE ONLY - SPECIFIC ERROR MESSAGES
      // ❌ SECURITY WARNING: In production, NEVER reveal whether email exists
      // This allows attackers to enumerate registered users (User Enumeration Attack)
      // 
      // ✅ PRODUCTION APPROACH: Use generic message for both cases
      // return res.status(401).json({ error: 'Invalid email or password' })
      //
      // For learning, we show specific messages to understand the flow:
      
      if (!user) {
        // Email not registered
        return res.status(401).json({ 
          error: 'Email is not registered. Please sign up first.' 
        })
      }
      
      // Compare password with hash
      const isPasswordValid = await bcrypt.compare(password, user.password)
      
      if (isPasswordValid) {
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          SECRET_KEY,
          { expiresIn: '24h' }
        )
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user
        
        res.json({
          message: 'Login successful',
          token,
          user: userWithoutPassword
        })
      } else {
        // Email exists but password is wrong
        return res.status(401).json({ 
          error: 'Invalid password. Please try again.' 
        })
      }
      
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Error logging in' })
    }
  })
  
  // Get current user (protected route)
  router.get('/me', async (req, res) => {
    try {
      const authHeader = req.headers.authorization
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
      }
      
      const token = authHeader.substring(7)
      
      // Verify token
      const decoded = jwt.verify(token, SECRET_KEY)
      
      // Find user
      await db.read()
      const user = db.data.users.find((u) => u.id === decoded.userId)
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user
        res.json(userWithoutPassword)
      } else {
        res.status(404).json({ error: 'User not found' })
      }
      
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' })
    }
  })

  // Employee CRUD endpoints
  // GET /api/employees - Get all employees
  router.get('/employees', async (req, res) => {
    try {
      await db.read()
      res.json(db.data.employees || [])
    } catch (error) {
      res.status(500).json({ error: 'Error fetching employees' })
    }
  })

  // GET /api/employees/:id - Get single employee
  router.get('/employees/:id', async (req, res) => {
    try {
      await db.read()
      const employee = db.data.employees.find(e => e.id === parseInt(req.params.id))
      
      if (employee) {
        res.json(employee)
      } else {
        res.status(404).json({ error: 'Employee not found' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching employee' })
    }
  })

  // POST /api/employees - Create employee
  router.post('/employees', async (req, res) => {
    try {
      await db.read()
      
      const newEmployee = {
        id: Date.now(),
        ...req.body
      }
      
      db.data.employees.push(newEmployee)
      await db.write()
      
      res.status(201).json(newEmployee)
    } catch (error) {
      res.status(500).json({ error: 'Error creating employee' })
    }
  })

  // PUT /api/employees/:id - Update employee
  router.put('/employees/:id', async (req, res) => {
    try {
      await db.read()
      const index = db.data.employees.findIndex(e => e.id === parseInt(req.params.id))
      
      if (index !== -1) {
        db.data.employees[index] = { ...db.data.employees[index], ...req.body }
        await db.write()
        res.json(db.data.employees[index])
      } else {
        res.status(404).json({ error: 'Employee not found' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating employee' })
    }
  })

  // DELETE /api/employees/:id - Delete employee
  router.delete('/employees/:id', async (req, res) => {
    try {
      await db.read()
      const index = db.data.employees.findIndex(e => e.id === parseInt(req.params.id))
      
      if (index !== -1) {
        db.data.employees.splice(index, 1)
        await db.write()
        res.json({ message: 'Employee deleted successfully' })
      } else {
        res.status(404).json({ error: 'Employee not found' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting employee' })
    }
  })
  
  return router
}
