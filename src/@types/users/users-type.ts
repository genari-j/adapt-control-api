import type { Prisma } from '@prisma/client'

export interface GetUsersFilters {
	name?: string
}

export interface SignInUsersToken {
	token: string
}

export interface UserBaseResponse {
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

export type CreateUserBody = Omit<
	UserBaseResponse,
	'id' | 'active' | 'avatar' | 'created_at' | 'updated_at' | 'deleted_at'
>

export type UpdateUserBody = Partial<Omit<UserBaseResponse, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>

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

export type GetUserResponse = PrismaUsersType
