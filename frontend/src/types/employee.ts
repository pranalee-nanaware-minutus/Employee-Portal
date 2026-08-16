export interface Employee {
  id: number
  name: string
  email: string
  department: string
  position: string
  salary: number
  joinDate: string
  status: 'active' | 'inactive'
}

export interface CreateEmployeeData {
  name: string
  email: string
  department: string
  position: string
  salary: number
  joinDate: string
  status: 'active' | 'inactive'
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
  id: number
}