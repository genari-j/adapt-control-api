import { z } from 'zod'

export const paymentsQuerySchema = z.object({
  name: z.string().optional()
})