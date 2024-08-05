import { z } from 'zod'

export const categoryQuerySchema = z.object({
	name: z.string().optional(),
})

export const categoryParamsSchema = z.object({
	id: z.string().min(1, 'ID inválido'),
})

export const createCategoryBodySchema = z.object({
	name: z.string().min(1, 'Produto inválido'),
	description: z.string().min(1, 'Descrição inválida'),
})
