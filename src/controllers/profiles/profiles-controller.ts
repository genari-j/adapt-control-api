import type { FastifyReply, FastifyRequest } from 'fastify'

import type { ProfilesRepository } from '../../models/interfaces/profiles'

import { env, profilesQuerySchema } from '../../validators'

export class ProfilesController {
	private readonly profilesRepository: ProfilesRepository

	constructor(profilesRepository: ProfilesRepository) {
		this.profilesRepository = profilesRepository
	}

	async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		try {
			const page = Number((request.query as { page?: string }).page) || Number(env.INITIAL_DATA_OFFSET)
			const limit = Number((request.query as { limit?: string }).limit) || Number(env.LIST_PER_PAGE)
			const skip = (page - 1) * limit

			const { name } = profilesQuerySchema.parse(request.query)
			const filters = { name }

			const [profiles, total, totalPage, currentPage] = await this.profilesRepository.findAll(skip, limit, filters)

			return reply.status(200).send({
				error: false,
				data: profiles,
				limit,
				total,
				totalPage,
				currentPage,
			})
		} catch (err) {
			reply.status(500).send(`Algo saiu como não esperado: ${err}`)
		}
	}
}
