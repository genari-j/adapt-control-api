import prismaClient from '../../../config/prisma-client'

import type { Product, ProductById, Products } from '../../interfaces/products'
import { RestRepository } from '../rest-repository'

class Repository extends RestRepository {
	async findAllProducts(skip: number, take: number, filters: any): Promise<Products> {
		const whereClause = {
			active: true,
			deleted_at: null,
			...filters,
		}

		const [data, total] = await prismaClient.$transaction([
			prismaClient.product.findMany({
				where: whereClause,
				include: {
					category: true,
				},
				skip,
				take,
			}),
			prismaClient.product.count({
				where: whereClause,
			}),
		])
		const pages = Math.ceil(total / take)
		const currentPage = Math.ceil(skip / take) + 1

		return {
			data,
			total,
			pages,
			currentPage,
		}
	}

	async findProductById(id: number): Promise<ProductById | null> {
		const query = await prismaClient.product.findFirst({
			where: { id },
			include: {
				category: true,
			},
		})
		return query
	}

	async findProductByExistingName(id: number, name: string): Promise<Product | null> {
		const query = await prismaClient.product.findFirst({
			where: {
				name: name,
				id: {
					not: id,
				},
			},
		})
		return query
	}

	async disableProduct(id: number): Promise<Product | null> {
		const query = await prismaClient.product.update({
			where: { id: id },
			data: { active: false },
		})
		return query
	}
}

const ProductsRepository = new Repository('product')

export default ProductsRepository
