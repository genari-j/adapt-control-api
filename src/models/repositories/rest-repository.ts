import prismaClient from '../../config/prisma-client'

export class RestRepository {
	public readonly entity: string

	constructor(entity: string) {
		this.entity = entity
	}

	async create(data: {} = {}) {
		const result = await (prismaClient as Record<string, any>)[this.entity].create({
			data,
		})
		return result
	}

	async findOneBy(field: string | number, value: string | number) {
		if (!field || !value) {
			throw new Error('Campos não especificados.')
		}

		const whereClause = { [field]: value }

		const result = await (prismaClient as Record<string, any>)[this.entity].findFirst({
			where: whereClause,
		})

		return result
	}

	async findAll(skip: number, take: number, filters: Record<string, any> = {}) {
		const whereClause = {
			active: true,
			deleted_at: null,
			...filters,
		}

		const [data, total] = await prismaClient.$transaction([
			(prismaClient as Record<string, any>)[this.entity].findMany({
				where: whereClause,
				skip,
				take,
			}),
			(prismaClient as Record<string, any>)[this.entity].count({
				where: whereClause,
			}),
		])
		const pages = Math.ceil(total / take)
		const currentPage = Math.ceil(skip / take) + 1

		return [data, total, pages, currentPage]
	}

	async findByIdAndUpdate(id: number, data: {} = {}) {
		if (!id) {
			throw new Error('ID não informado.')
		}

		const result = await (prismaClient as Record<string, any>)[this.entity].update({
			where: { id },
			data,
		})

		return result
	}
}
