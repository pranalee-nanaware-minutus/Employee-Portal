// User model for database operations
class UserModel {
  constructor(db) {
    this.db = db;
  }

  // Find user by email
  async findByEmail(email) {
    await this.db.read();
    return this.db.data.users.find(user => user.email === email);
  }

  // Find user by ID
  async findById(id) {
    await this.db.read();
    return this.db.data.users.find(user => user.id === id);
  }

  // Create new user
  async create(userData) {
    await this.db.read();
    const newUser = {
      id: Date.now(),
      ...userData
    };
    this.db.data.users.push(newUser);
    await this.db.write();
    return newUser;
  }

  // Update user
  async update(id, userData) {
    await this.db.read();
    const index = this.db.data.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.db.data.users[index] = { ...this.db.data.users[index], ...userData };
      await this.db.write();
      return this.db.data.users[index];
    }
    return null;
  }

  // Delete user
  async delete(id) {
    await this.db.read();
    const index = this.db.data.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.db.data.users.splice(index, 1);
      await this.db.write();
      return true;
    }
    return false;
  }
}

module.exports = UserModel;