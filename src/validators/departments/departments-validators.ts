import { z } from 'zod'

export const departmentsQuerySchema = z.object({
  name: z.string().optional()
})