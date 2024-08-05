interface ProfilePermissions {
	id: number
	code: string
	description: string
	active: boolean
	created_at: Date
	updated_at: Date
	deleted_at: Date | null
}

interface ProfilePermissionsRepository {
	findByProfileId(id: number): Promise<ProfilePermissions | null>
}

export type { ProfilePermissions, ProfilePermissionsRepository }
