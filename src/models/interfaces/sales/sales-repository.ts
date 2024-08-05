import { type Prisma, Sale } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'

type CreateSale = {
	total: Decimal
	payment_id: number
	sale_date: Date
}

type SaleData = Prisma.SaleGetPayload<{
	include: {
		payment: true
		Sale_relationship_product: {
			include: {
				product: {
					include: {
						category: true
					}
				}
			}
		}
	}
}>

type Sales = {
	data: SaleData[]
	total: number
	pages: number
	currentPage: number
}

interface SalesRepository {
	findAllSales(skip: number, limit: number, filters: any): Promise<Sales>
	findAll(skip: number, limit: number, filters: any): Promise<Sale[]>
	findOneBy(field: string | number, value: string | number): Promise<Sale>
	create(payload: CreateSale): Promise<Sale>
}

export { type CreateSale, Sale, type Sales, type SalesRepository }
