interface CategoryType {
	name: string
	description: string
}
type Categories = CategoryType & {
	id?: number
	active?: boolean
	created_at?: Date
	updated_at?: Date
	deleted_at?: Date | null
}

interface filters {
	name: string | undefined
}

interface CategoriesRepository {
	findAll(skip: number, limit: number, filters: filters): Promise<Categories[]>
	findOneBy(field: string | number, value: string | number): Promise<Categories>
	create(payload: Categories): Promise<Categories>
}

export type { Categories, CategoriesRepository }
