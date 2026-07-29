const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const path = require('path')

// Initialize lowdb with default data
const adapter = new JSONFile(path.join(__dirname, 'db.json'))
const db = new Low(adapter, {
  users: [],
  employees: []
})

module.exports = { db }