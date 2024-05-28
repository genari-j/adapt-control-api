import { RestRepository } from '../rest-repository'

class Repository extends RestRepository {}

const DepartmentsRepository = new Repository('department')

export default DepartmentsRepository