// Initial data seeding script
const fs = require('fs');
const path = require('path');

// Sample initial data
const initialData = {
  users: [
    {
      id: 1,
      email: "admin@company.com",
      password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIJ.6yN7H5Q5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5",
      name: "Admin User",
      role: "admin"
    }
  ],
  employees: [
    {
      id: 1784799741077,
      name: "sayali",
      email: "sayali@gmail.com",
      department: "Engineering",
      position: "developer",
      salary: 50000,
      joinDate: "2026-07-23",
      status: "inactive"
    }
  ]
};

// Write initial data to db.json
const dbPath = path.join(__dirname, '..', 'db.json');
fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));

console.log('Initial data seeded successfully!');