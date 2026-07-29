// Employee model for database operations
class EmployeeModel {
  constructor(db) {
    this.db = db;
  }

  // Get all employees
  async findAll() {
    await this.db.read();
    return this.db.data.employees || [];
  }

  // Find employee by ID
  async findById(id) {
    await this.db.read();
    return this.db.data.employees.find(emp => emp.id === parseInt(id));
  }

  // Create new employee
  async create(employeeData) {
    await this.db.read();
    const newEmployee = {
      id: Date.now(),
      ...employeeData
    };
    this.db.data.employees.push(newEmployee);
    await this.db.write();
    return newEmployee;
  }

  // Update employee
  async update(id, employeeData) {
    await this.db.read();
    const index = this.db.data.employees.findIndex(emp => emp.id === parseInt(id));
    if (index !== -1) {
      this.db.data.employees[index] = { ...this.db.data.employees[index], ...employeeData };
      await this.db.write();
      return this.db.data.employees[index];
    }
    return null;
  }

  // Delete employee
  async delete(id) {
    await this.db.read();
    const index = this.db.data.employees.findIndex(emp => emp.id === parseInt(id));
    if (index !== -1) {
      this.db.data.employees.splice(index, 1);
      await this.db.write();
      return true;
    }
    return false;
  }
}

module.exports = EmployeeModel;