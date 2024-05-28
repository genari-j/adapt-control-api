import { RestRepository } from '../rest-repository'

class Repository extends RestRepository {}

const CategoriesRepository = new Repository('categories')

export default CategoriesRepository