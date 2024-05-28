import prismaClient from '../config/prisma-client'

export const checkingDBToInsertSeeds = async (arrayValues: any[], table: string, field: string | number) => {
  for (const value of arrayValues) {
    const existingValue = await (prismaClient as Record<string, any>)[table].findFirst({
      where: { [field]: value[field]}
    })

    if (!existingValue) {
      await (prismaClient as Record<string, any>)[table].create({
        data: value
      })
    }
  }
}