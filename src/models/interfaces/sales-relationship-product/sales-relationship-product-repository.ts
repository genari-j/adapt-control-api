interface SaleRelationshipProductType {
  sale_id: number
  product_id: number
  amount_product: number
}
type SalesRelationshipProduct = SaleRelationshipProductType & { id?: number, created_at?: Date, updated_at?: Date, deleted_at?: Date | null }

interface SalesRelationshipProductRepository {
  findAll (skip: number, limit: number, filters: any): Promise<SalesRelationshipProduct[]>
  findOneBy (field: string | number, value: string | number): Promise<SalesRelationshipProduct>
  create (payload: SaleRelationshipProductType): Promise<SaleRelationshipProductType>
}

export {
  SalesRelationshipProduct,
  SalesRelationshipProductRepository
}
