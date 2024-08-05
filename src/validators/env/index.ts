import { z } from 'zod'
import 'dotenv/config'

const errorMessage = 'Caracteres não informados 😕'

const envSchema = z.object({
	APP_PORT: z
		.string()
		.min(1)
		.transform((port) => Number(port)),
	APP_SECRET: z.string().min(1, errorMessage),
	BCRYPT_SALT_ROUNDS: z
		.string()
		.min(1, errorMessage)
		.transform((salt) => Number(salt)),
	URL_FRONTEND: z.string().min(1, errorMessage),
	HOST_RESET_PSW: z.string().min(1, errorMessage),
	PORT_RESET_PSW: z
		.string()
		.min(1, errorMessage)
		.transform((port) => Number(port)),
	EMAIL_RESET_PSW: z.string().min(1, errorMessage),
	PSW_RESET_PSW: z.string().min(1, errorMessage),
	EXP_RESET_PSW: z.string().min(1, errorMessage),
	INITIAL_DATA_OFFSET: z
		.string()
		.min(1, errorMessage)
		.transform((offSet) => Number(offSet)),
	LIST_PER_PAGE: z
		.string()
		.min(1, errorMessage)
		.transform((perPage) => Number(perPage)),
	DATABASE_URL: z.string().min(1, errorMessage),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('💬 Ops, ocorreu algum erro relacionado a variáveis de ambiente.', _env.error.format())
	throw new Error('💬 Variáveis de ambiente inválidas.')
}

export const env = _env.data
