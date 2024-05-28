import { RestRepository } from '../rest-repository'

class Repository extends RestRepository {}

const CategoriesRepository = new Repository('payment')

export default CategoriesRepository