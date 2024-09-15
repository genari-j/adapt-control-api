import { z } from 'zod'

export const productQuerySchema = z.object({
	name: z.string().optional(),
})

export const productParamsSchema = z.object({
	id: z.string().min(1, 'Produto inválido'),
})

export const createProductBodySchema = z.object({
	name: z.string().min(1, 'Produto inválido'),
	description: z.string().min(1, 'Descrição inválida'),
	quantity: z.number().min(1, 'Quantidade inválida'),
	price: z.number().min(1, 'Valor inválido'),
	category_id: z.number().min(1, 'Categoria inválida'),
})

export const updateProductBodySchema = z.object({
	name: z.string().min(1, 'Nome inválido'),
	description: z.string().min(1, 'Descrição inválida'),
	quantity: z.coerce.number().min(1, 'Quantidade inválida'),
	category_id: z.coerce.number().min(1, 'Categoria inválida'),
	offer_price: z.coerce.number().optional(),
	price: z.coerce.number().min(1, 'Valor inválido'),
	active: z.boolean().optional(),
})
