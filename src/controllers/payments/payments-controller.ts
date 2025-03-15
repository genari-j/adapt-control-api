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
			const { page = env.INITIAL_DATA_OFFSET, limit = env.LIST_PER_PAGE } = request.query as {
				page?: string
				limit?: string
			}
			const skip = (Number(page) - 1) * Number(limit)

			const { name } = paymentsQuerySchema.parse(request.query)
			const filters = { name }

			const [payments, total, totalPage, currentPage] = await this.paymentsRepository.findAll(
				skip,
				Number(limit),
				filters,
			)

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
