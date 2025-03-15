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
			const { page = env.INITIAL_DATA_OFFSET, limit = env.LIST_PER_PAGE } = request.query as {
				page?: string
				limit?: string
			}
			const skip = (Number(page) - 1) * Number(limit)

			const { name } = profilesQuerySchema.parse(request.query)
			const filters = { name }

			const [profiles, total, totalPage, currentPage] = await this.profilesRepository.findAll(
				skip,
				Number(limit),
				filters,
			)

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
