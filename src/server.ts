import fastify from 'fastify'

import path from 'node:path'

import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'

import { appRoutes } from './routes'
import { databaseHealth } from './helpers'
import { env } from './validators'

import 'dotenv/config'

const app = fastify()

app.register(cors, { origin: '*', methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] })
app.register(multipart)

for (const route of appRoutes) {
	app.register(route)
}

app.register(fastifyStatic, {
	root: path.join(__dirname, 'uploads', 'products'),
	prefix: '/uploads/products',
})

app.listen({ port: Number(process.env.PORT) || Number(env.APP_PORT), host: '0.0.0.0' }).then(async () => {
	await databaseHealth()
	console.log(`Application is running on port: ${env.APP_PORT}`)
})
