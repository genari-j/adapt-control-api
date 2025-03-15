import { z } from 'zod'

export const bearerTokenSchema = z.string().min(1, 'Token inválido')

export const setNewPasswordSchema = z.object({
	password: z.string().min(1, 'Senha inválida'),
	confirmPassword: z.string().min(1, 'Senha inválida'),
})

export const passwordRecoverySchema = z.object({
	email: z.string().min(1, 'Email inválido'),
})

export const userQuerySchema = z.object({
	name: z.string().optional(),
})

export const userParamsSchema = z.object({
	id: z.string().min(1, 'ID inválido'),
})

export const signInBodySchema = z.object({
	user_code: z
		.number()
		.min(1, 'Login inválido')
		.transform((val) => Number(val)),
	password: z.string().min(1, 'Login inválido'),
})

export const signUpBodySchema = z.object({
	name: z.string().min(1, 'Nome inválido'),
	user_code: z
		.number()
		.min(1, 'Login inválido')
		.transform((val) => Number(val)),
	email: z
		.string()
		.optional()
		.refine((value) => (value !== undefined ? value.endsWith('@hotmail.com') : null), {
			message: 'O e-mail deve conter um domínio @hotmail.com',
		}),
	password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
	department_id: z.number().min(1, 'Departamento inválido'),
	profile_id: z.number().min(1, 'Perfil inválido'),
})

export const updateUserBodySchema = z.object({
	name: z.string().min(1, 'Nome inválido'),
	user_code: z
		.number()
		.min(1, 'Login inválido')
		.transform((number) => Number(number)),
	email: z
		.string()
		.optional()
		.refine((value) => (value !== undefined ? value.endsWith('@hotmail.com') : null), {
			message: 'O e-mail deve conter um domínio @hotmail.com',
		}),
	department_id: z.number().min(1, 'Departamento inválido'),
	profile_id: z.number().min(1, 'Perfil inválido'),
	active: z.boolean().optional(),
})
