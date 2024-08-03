import { Prisma, Users as User } from '@prisma/client'

type CreateUser = {
  name: string
  user_code: number
  email: string | undefined
  password: string | undefined
  department_id: number
  profile_id: number
}

type UserData = Prisma.UsersGetPayload<{
  include: {
    department: true,
    profile: true
  }
}>

type Users = {
  data: UserData[]
  total: number
  pages: number
  currentPage: number
}

interface UserById {
  id: number
  name: string
  user_code: number
  email: string | null
  department: {
    id: number
    name: string
  }
  profile: {
    id: number
    name: string
  }
  active: boolean
  avatar: string | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

interface UserByField {
  id: number
  name: string
  user_code: number
  email: string | null
  department_id: number
  profile_id: number
  password: string
  active: boolean
  avatar: string | null
  created_at: Date,
  updated_at: Date,
  deleted_at: Date | null
}

interface filters {
  name: string | undefined
}

interface UsersRepository {
  create (payload: CreateUser): Promise<Users>
  findAllUsers (skip: number, limit: number, filters: filters): Promise<Users>
  findAll (skip: number, limit: number, filters: any): Promise<User[]>
  findOneBy (field: string | number, value: string | number | undefined): Promise<User>
  findUserById (id: number): Promise<UserById | null>
  findUserByExistingCode (id: number, code: number): Promise<UserByField | null>
  findUserByExistingEmail (id: number, email: string): Promise<UserByField | null>
  findByIdAndUpdate (id: number, payload: {}): Promise<UserByField | null>
  disableUser (id: number): Promise<UserByField | null>
}

export {
  CreateUser,
  UserByField,
  UserById,
  Users,
  UsersRepository
}
