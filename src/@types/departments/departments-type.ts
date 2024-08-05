// GET ALL DEPARTMENTS - RESPONSE
export interface GetDepartmentsResponse {
	id: number
	name: string
	active: boolean
	created_at: Date
	updated_at: Date
	deleted_at: Date | null
}
