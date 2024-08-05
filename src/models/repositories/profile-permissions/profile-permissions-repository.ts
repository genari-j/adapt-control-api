import prismaClient from '../../../config/prisma-client'
import { RestRepository } from '../rest-repository'

import type { ProfilePermissions } from '../../interfaces/profile-permissions'

class Repository extends RestRepository {
	async findByProfileId(id: number): Promise<ProfilePermissions | null> {
		const query = await prismaClient.profile_permission.findFirst({
			where: {
				id: id,
			},
		})
		return query
	}
}

const ProfilePermissionsRepository = new Repository('profile_permission')

export default ProfilePermissionsRepository
