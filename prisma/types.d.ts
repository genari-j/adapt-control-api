import type { Prisma, PrismaClient } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

export type PrismaTransactionClient = Omit<
	PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	'$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>
