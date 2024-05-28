interface CategoryType {
  name: string
  description: string
}
type Categories = CategoryType & { id?: number, active?: Boolean, created_at?: Date, updated_at?: Date, deleted_at?: Date | null }

interface CategoriesRepository {
  findAll (skip: number, limit: number, filters: any): Promise<Categories[]>
  findOneBy (field: string | number, value: string | number): Promise<Categories[]>
  create (payload: Categories): Promise<Categories[]>
}

export {
  Categories,
  CategoriesRepository
}
