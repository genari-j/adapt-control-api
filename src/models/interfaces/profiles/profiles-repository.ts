interface Profiles {
  id: number
  name: string
  active: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

interface ProfilesRepository {
  findAll (skip: number, limit: number, filters: any): Promise<Profiles[]>
  findOneBy (field: string | number, value: string | number): Promise<Profiles[]>
}

export {
  Profiles,
  ProfilesRepository
}
