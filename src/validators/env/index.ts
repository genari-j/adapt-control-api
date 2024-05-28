import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  APP_PORT: z.string().min(1, 'Caracteres não informados 😕').transform(port => Number(port)),
  APP_SECRET: z.string().min(1, 'Caracteres não informados 😕'),
  BCRYPT_SALT_ROUNDS: z.string().min(1, 'Caracteres não informados 😕').transform(salt => Number(salt)),
  URL_FRONTEND: z.string().min(1, 'Caracteres não informados 😕'),
  HOST_RESET_PSW: z.string().min(1, 'Caracteres não informados 😕'),
  PORT_RESET_PSW: z.string().min(1, 'Caracteres não informados 😕').transform(port => Number(port)),
  EMAIL_RESET_PSW: z.string().min(1, 'Caracteres não informados 😕'),
  PSW_RESET_PSW: z.string().min(1, 'Caracteres não informados 😕'),
  EXP_RESET_PSW: z.string().min(1, 'Caracteres não informados 😕'),
  INITIAL_DATA_OFFSET: z.string().min(1, 'Caracteres não informados 😕').transform(data => Number(data)),
  LIST_PER_PAGE: z.string().min(1, 'Caracteres não informados 😕').transform(data => Number(data)),
  DATABASE_URL: z.string().min(1, 'Caracteres não informados 😕'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('💬 Ops, ocorreu algum erro relacionado a variáveis de ambiente.', _env.error.format())
  throw new Error('💬 Variáveis de ambiente inválidas.')
}

export const env = _env.data