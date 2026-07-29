const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const path = require('path')
const express = require('express')

// Import database
const { db } = require('../database')

// Create Express router for custom API routes
const apiRouter = express.Router()

// Create JSON Server router
const router = jsonServer.router(path.join(__dirname, '../database/db.json'))
const middlewares = jsonServer.defaults()

// Create server
const server = jsonServer.create()

// Load custom routes
const userRoutes = require('./routes')(apiRouter, db)

// Use middlewares
server.use(middlewares)
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// Mount custom API routes
server.use('/api', apiRouter)

// Mount JSON Server router (for default CRUD operations)
server.use(router)

// Start server
const PORT = 3001
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
  console.log(`API endpoints available at http://localhost:${PORT}/api`)
  console.log(`Database file: ${path.join(__dirname, '../database/db.json')}`)
})
