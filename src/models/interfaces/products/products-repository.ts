import { type Prisma, Product } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'

interface CreateProduct {
	name: string
	description: string
	quantity: number
	price: Decimal
	category_id: number
}

type ProductData = Prisma.ProductGetPayload<{
	include: { category: true }
}>

type Products = {
	data: ProductData[]
	total: number
	pages: number
	currentPage: number
}

interface ProductById {
	id: number
	name: string
	description: string
	quantity: number
	price: Decimal | number
	category: {
		id: number
		name: string
		description: string
		active: boolean
		created_at: Date
		updated_at: Date
	}
	avatar: string | null
	active: boolean
	created_at: Date
	updated_at: Date
	deleted_at: Date | null
}

interface UpdateProduct {
	name?: string
	description?: string
	quantity?: number | undefined
	price?: Decimal | undefined | number
	category_id?: number
	active?: boolean
	avatar?: string | null
}

interface ProductsRepository {
	create(payload: CreateProduct): Promise<Product[]>
	findAll(skip: number, limit: number, filters: any): Promise<Product[]>
	findAllProducts(skip: number, limit: number, filters: any): Promise<Products>
	findOneBy(field: string | number, value: string | number): Promise<Product>
	findProductById(id: number): Promise<ProductById | null>
	findProductByExistingName(id: number, name: string): Promise<Product | null>
	findByIdAndUpdate(id: number, payload: {}): Promise<UpdateProduct | null>
	disableProduct(id: number): Promise<UpdateProduct | null>
}

export { type Products, Product, type UpdateProduct, type ProductById, type ProductsRepository }
