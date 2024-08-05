import type { FastifyReply, FastifyRequest } from 'fastify'

import type { CategoriesRepository } from '../../models/interfaces/categories'
import type { ProductsRepository, UpdateProduct } from '../../models/interfaces/products'

import { existsSync } from 'node:fs'
import Decimal from 'decimal.js'
import { cleanString, deleteTmpFile, productsPath, saveFile } from '../../helpers'

import {
	createProductBodySchema,
	env,
	productParamsSchema,
	productQuerySchema,
	updateProductBodySchema,
} from '../../validators'

export class ProductsController {
	private readonly productsRepository: ProductsRepository
	private readonly categoriesRepository: CategoriesRepository

	constructor(productsRepository: ProductsRepository, categoriesRepository: CategoriesRepository) {
		this.productsRepository = productsRepository
		this.categoriesRepository = categoriesRepository
	}

	async getAll(request: FastifyRequest, reply: FastifyReply) {
		try {
			const page = Number((request.query as { page?: string }).page) || Number(env.INITIAL_DATA_OFFSET)
			const limit = Number((request.query as { limit?: string }).limit) || Number(env.LIST_PER_PAGE)
			const skip = (page - 1) * limit

			const { name } = productQuerySchema.parse(request.query)
			const filters = { name }

			const { data, total, pages, currentPage } = await this.productsRepository.findAllProducts(skip, limit, filters)

			const mappedProducts = data?.map((product) => {
				return {
					id: product.id,
					name: product.name,
					description: product.description,
					quantity: product.quantity,
					price: product.price,
					category: {
						id: product.category_id,
						name: product.category.name,
						description: product.category.description,
						active: product.category.active,
						created_at: product.category.created_at,
						updated_at: product.category.updated_at,
					},
					avatar: `http://192.168.0.188:3002/public/${product.avatar}`,
					active: product.active,
					created_at: product.created_at,
					updated_at: product.updated_at,
					deleted_at: product.deleted_at,
				}
			})

			return reply.status(200).send({
				error: false,
				data: mappedProducts,
				limit,
				total,
				pages,
				currentPage,
			})
		} catch (err) {
			return reply.status(500).send(`Algo saiu como não esperado: ${err}`)
		}
	}

	async getById(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { id } = productParamsSchema.parse(request.params)

			const productById = await this.productsRepository.findProductById(Number(id))
			if (!productById) {
				return reply.status(404).send({ error: true, message: 'O Produto especificado não existe.' })
			}

			const product = {
				id: productById.id,
				name: productById.name,
				description: productById.description,
				quantity: productById.quantity,
				price: productById.price,
				category: {
					id: productById.category.id,
					name: productById.category.name,
					description: productById.category.description,
					active: productById.category.description,
					created_at: productById.category.created_at,
					updated_at: productById.category.updated_at,
				},
				avatar: `http://192.168.0.188:3002/public/${productById.avatar}`,
				active: productById.active,
				created_at: productById.created_at,
				updated_at: productById.updated_at,
				deleted_at: productById.deleted_at,
			}

			return reply.status(200).send({
				error: false,
				data: product,
			})
		} catch (err) {
			return reply.status(500).send(`Algo saiu como não esperado: ${err}`)
		}
	}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { name, description, quantity, price, category_id } = createProductBodySchema.parse(request.body)

			const productByName = await this.productsRepository.findOneBy('name', name)
			if (productByName) {
				return reply.status(400).send({ error: true, message: 'O produto informado já existe.' })
			}

			const [categoryById] = await this.categoriesRepository.findOneBy('id', category_id)
			if (!categoryById) {
				return reply.status(404).send({ error: true, message: 'A categoria informada não existe.' })
			}

			const priceDecimal = new Decimal(price)
			const payload = {
				name,
				description,
				quantity,
				price: priceDecimal,
				category_id,
			}
			const productCreated = await this.productsRepository.create(payload)

			return reply.status(201).send({
				error: false,
				data: productCreated,
			})
		} catch (err) {
			return reply.status(500).send(`Algo saiu como não esperado: ${err}`)
		}
	}

	async update(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { id } = productParamsSchema.parse(request.params)
			const { name, description, quantity, price, category_id, active } = updateProductBodySchema.parse(request.body)

			const productAvatar: any = request.file

			if (existsSync(`${productsPath}/${productAvatar?.filename}`)) {
				return reply.status(400).send({
					error: true,
					message: 'Outro aquivo com esse nome já existe.',
				})
			}

			const finalFileName = `${Date.now() + '-' + cleanString(productAvatar?.originalname)}`

			const productById = await this.productsRepository.findProductById(Number(id))
			if (!productById) {
				deleteTmpFile(productAvatar?.path)
				return reply.status(404).send({
					error: true,
					message: 'O Produto informado não existe.',
				})
			}

			const payload: UpdateProduct = {}

			if (name) {
				const productByName = await this.productsRepository.findProductByExistingName(Number(id), name)
				if (productByName) {
					deleteTmpFile(productAvatar?.path)
					return reply.status(400).send({
						error: true,
						message: 'O Produto informado já existe.',
					})
				}
				payload.name = name
			}

			if (description) {
				payload.description = description
			}
			if (quantity) {
				payload.quantity = quantity
			}
			if (price) {
				payload.price = price
			}

			if (active || String(active) === '0') {
				payload.active = active
			}

			if (category_id) {
				const categoryById = await this.categoriesRepository.findOneBy('id', category_id)
				if (!categoryById) {
					deleteTmpFile(productAvatar?.path)
					return reply.status(404).send({
						error: true,
						message: 'O Produto informado não existe.',
					})
				}
				payload.category_id = category_id
			}

			if (finalFileName.length > 0) {
				payload.avatar = finalFileName
			}

			if (Object.keys(payload).length) {
				await this.productsRepository.findByIdAndUpdate(Number(id), payload)
			}

			await saveFile(productAvatar?.path, `${productsPath}/${finalFileName}`)

			return reply.status(200).send({
				error: false,
				message: 'O produto foi atualizado.',
			})
		} catch (err) {
			// if (request.file !== undefined) deleteTmpFile(productAvatar?.path)
			return reply.status(500).send(`Algo saiu como não esperado: ${err}`)
		}
	}

	async delete(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { id } = productParamsSchema.parse(request.params)
			if (!id) {
				return reply.status(400).send({ error: true, message: 'ID do produto não informado.' })
			}

			const product = await this.productsRepository.findOneBy('id', Number(id))
			if (!product) {
				return reply.status(404).send({ error: true, message: 'O usuário informado não existe.' })
			}

			await this.productsRepository.disableProduct(Number(id))
			return reply.status(204).send()
		} catch (err) {
			reply.status(500).send(`Algo saiu como não esperado: ${err}`)
		}
	}
}
