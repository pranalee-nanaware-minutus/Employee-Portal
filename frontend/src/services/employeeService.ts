import { api } from './axios'
import type { Employee, CreateEmployeeData, UpdateEmployeeData } from '../types/employee'

export const employeeService = {
  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    const response = await api.get<Employee[]>('/employees')
    return response.data
  },

  // Get single employee by ID
  async getEmployeeById(id: number): Promise<Employee> {
    const response = await api.get<Employee>(`/employees/${id}`)
    return response.data
  },

  // Create new employee
  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    const response = await api.post<Employee>('/employees', data)
    return response.data
  },

  // Update employee
  async updateEmployee(id: number, data: UpdateEmployeeData): Promise<Employee> {
    const response = await api.put<Employee>(`/employees/${id}`, data)
    return response.data
  },

  // Delete employee
  async deleteEmployee(id: number): Promise<void> {
    await api.delete(`/employees/${id}`)
  }
}