import { RestRepository } from '../rest-repository'

class Repository extends RestRepository {}

const SalesRelationshipProductRepository = new Repository('sale_relationship_product')

export default SalesRelationshipProductRepository