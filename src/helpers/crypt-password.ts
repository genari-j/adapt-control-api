import { genSalt, hash } from 'bcryptjs'
import { env } from '../validators'

export const cryptPassword = async (password: string | undefined) => {
  try {
    const salt = await genSalt(Number(env.BCRYPT_SALT_ROUNDS))
    if (password) { return await hash(password, salt) }
  } catch (error) {
    console.error(`Ocorreu algum erro ao aplicar o Hash de Senha: ${error}`)
    throw error
  }
}
