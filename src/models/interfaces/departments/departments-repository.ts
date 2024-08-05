interface Departments {
	id: number
	name: string
	active: boolean
	created_at: Date
	updated_at: Date
	deleted_at: Date | null
}

interface DepartmentsRepository {
	findAll(skip: number, limit: number, filters: any): Promise<Departments[]>
	findOneBy(field: string | number, value: string | number): Promise<Departments>
}

export type { Departments, DepartmentsRepository }
