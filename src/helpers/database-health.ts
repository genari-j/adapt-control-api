import prismaClient from '../config/prisma-client'

export const databaseHealth = async () => {
  try {
    await prismaClient.$queryRaw`SELECT now()`
  } catch (error) {
    console.log(error)
    throw new Error('Erro ao realizar conexão com o MySQL');
  }
}