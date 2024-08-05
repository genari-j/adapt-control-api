import type { FastifyReply, FastifyRequest } from 'fastify'

import type { PaymentsRepository } from '../../models/interfaces/payments'

import { env, paymentsQuerySchema } from '../../validators'

export class PaymentsController {
	private readonly paymentsRepository: PaymentsRepository

	constructor(paymentsRepository: PaymentsRepository) {
		this.paymentsRepository = paymentsRepository
	}

	async getAll(request: FastifyRequest, reply: FastifyReply) {
		try {
			const page = Number((request.query as { page?: string }).page) || Number(env.INITIAL_DATA_OFFSET)
			const limit = Number((request.query as { limit?: string }).limit) || Number(env.LIST_PER_PAGE)
			const skip = (page - 1) * limit

			const { name } = paymentsQuerySchema.parse(request.query)
			const filters = { name }

			const [payments, total, totalPage, currentPage] = await this.paymentsRepository.findAll(skip, limit, filters)

			return reply.status(200).send({
				error: false,
				data: payments,
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
