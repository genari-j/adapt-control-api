import { RestRepository } from '../rest-repository'

class Repository extends RestRepository {}

const ProfilesRepository = new Repository('profile')

export default ProfilesRepository
