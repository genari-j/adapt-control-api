import type { FastifyReply, FastifyRequest } from 'fastify'

import type { Categories, CategoriesRepository } from '../../models/interfaces/categories'

import { categoryQuerySchema, createCategoryBodySchema, env } from '../../validators'

export class CategoriesController {
	private readonly categoriesRepository: CategoriesRepository

	constructor(categoriesRepository: CategoriesRepository) {
		this.categoriesRepository = categoriesRepository
	}

	async getAll(request: FastifyRequest, reply: FastifyReply) {
		try {
			const page = Number((request.query as { page?: string }).page) || Number(env.INITIAL_DATA_OFFSET)
			const limit = Number((request.query as { limit?: string }).limit) || Number(env.LIST_PER_PAGE)
			const skip = (page - 1) * limit

			const { name } = categoryQuerySchema.parse(request.query)
			const filters = { name }

			const [categories, total, pages, currentPage] = await this.categoriesRepository.findAll(skip, limit, filters)

			return reply.status(200).send({
				error: false,
				data: categories,
				limit,
				total,
				pages,
				currentPage,
			})
		} catch (err) {
			return reply.status(500).send(`Algo saiu como não esperado: ${err}`)
		}
	}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { name, description } = createCategoryBodySchema.parse(request.body)

			const categoryByName = await this.categoriesRepository.findOneBy('name', name)
			if (categoryByName) {
				return reply.status(400).send({ error: true, message: 'A categoria informada já existe.' })
			}

			const payload: Categories = {
				name,
				description,
			}
			const categoryCreated = await this.categoriesRepository.create(payload)

			return reply.status(201).send({
				error: false,
				data: categoryCreated,
			})
		} catch (err) {
			return reply.status(500).send(`Algo saiu como não esperado: ${err}`)
		}
	}
}
