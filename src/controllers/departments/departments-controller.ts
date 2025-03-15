import type { FastifyReply, FastifyRequest } from 'fastify'

import type { DepartmentsRepository } from '../../models/interfaces/departments'

import { departmentsQuerySchema, env } from '../../validators'

export class DepartmentsController {
	private readonly departmentsRepository: DepartmentsRepository

	constructor(departmentsRepository: DepartmentsRepository) {
		this.departmentsRepository = departmentsRepository
	}

	async getAll(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { page = env.INITIAL_DATA_OFFSET, limit = env.LIST_PER_PAGE } = request.query as {
				page?: string
				limit?: string
			}
			const skip = (Number(page) - 1) * Number(limit)

			const { name } = departmentsQuerySchema.parse(request.query)
			const filters = { name }

			const [departments, total, totalPage, currentPage] = await this.departmentsRepository.findAll(
				skip,
				Number(limit),
				filters,
			)

			return reply.status(200).send({
				error: false,
				data: departments,
				limit,
				total,
				totalPage,
				currentPage,
			})
		} catch (err) {
			return reply.status(500).send(`Algo saiu como não esperado: ${err}`)
		}
	}
}
