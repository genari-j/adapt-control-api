import { z } from 'zod'

export const profilesQuerySchema = z.object({
	name: z.string().optional(),
})
