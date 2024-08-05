import { z } from 'zod'

export const saleQuerySchema = z.object({
	payment: z.number().optional(),
	date: z.string().optional(),
})

export const saleParamsSchema = z.object({
	id: z.string().min(1, 'ID inválido'),
})

const productSchema = z.object({
	id: z.number().min(1, 'ID do produto inválido'),
	amount: z.number().min(1, 'Quantidade inválida'),
})

export const newSaleSchema = z.object({
	payment_id: z.number().min(1, 'ID do método de pagamento inválido'),
	sale_date: z
		.string()
		.min(1, 'Data inválida')
		.transform((date) => new Date(date)),
	products: z.array(productSchema),
})
