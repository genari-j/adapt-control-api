// GET ALL PROFILES PERMISSIONS - RESPONSE
export interface GetProfilePermissionsResponse {
	id: number
	code: string
	description: string
	active: boolean
	created_at: Date
	updated_at: Date
	deleted_at: Date | null
}
