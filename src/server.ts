import fastify, { type FastifyRequest, type FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import path from 'node:path'
import 'dotenv/config'

import { databaseHealth } from './helpers'
import { appRoutes } from './routes'
import { env } from './validators'

const app = fastify()
const pathhh = path.join(__dirname, 'uploads', 'products')
console.log(pathhh)

app.register(cors, { origin: '*', methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] })
app.register(multipart)

for (const route of appRoutes) {
	app.register(route)
}

app.register(fastifyStatic, {
	root: path.join(__dirname, 'uploads', 'products'), // Diretório onde os arquivos estão localizados
	prefix: '/public/', // Prefixo para acessar arquivos publicamente
})

app.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
	return reply.send({
		error: false,
		message: 'API is running 🚀',
	})
})

app.listen({ port: Number(process.env.PORT) || Number(env.APP_PORT), host: '0.0.0.0' }).then(async () => {
	await databaseHealth()
	console.log(`Application is running on port: ${env.APP_PORT}`)
})
