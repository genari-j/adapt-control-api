type PaymentType = {
	name: string
}
type Payments = PaymentType & {
	id?: number
	active?: boolean
	created_at?: Date
	updated_at?: Date
	deleted_at?: Date | null
}

interface PaymentsRepository {
	findAll(skip: number, limit: number, filters: any): Promise<Payments[]>
	findOneBy(field: string | number, value: string | number): Promise<Payments>
}

export type { Payments, PaymentsRepository }
