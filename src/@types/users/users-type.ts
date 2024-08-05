import type { Prisma } from '@prisma/client'

export interface GetUsersFilters {
	name?: string
}

export interface SignInUsersToken {
	token: string
}

export interface CreateUserBody {
	name: string
	user_code: number
	email: string | undefined
	password: string
	department_id: number
	profile_id: number
}

export interface UpdateUserBody {
	name?: string
	user_code?: number
	email?: string | undefined
	password?: string
	department_id?: number
	profile_id?: number
	active?: boolean
}

export interface UserDefaultResponse {
	id: number
	name: string
	user_code: number
	email: string | null
	password: string
	department_id: number
	profile_id: number
	active: boolean
	avatar: string | null
	created_at: Date
	updated_at: Date
	deleted_at: Date | null
}

type PrismaUsersType = Prisma.UsersGetPayload<{
	include: {
		department: true
		profile: true
	}
}>

export interface GetUsersResponse {
	data: PrismaUsersType[]
	total: number
	pages: number
	currentPage: number
}

export type GetUserResponse = Prisma.UsersGetPayload<{
	include: {
		department: true
		profile: true
	}
}>
