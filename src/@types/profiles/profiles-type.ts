// GET ALL PROFILES - RESPONSE
export interface GetProfilesResponse {
	id: number
	name: string
	active: boolean
	created_at: Date
	updated_at: Date
	deleted_at: Date | null
}
