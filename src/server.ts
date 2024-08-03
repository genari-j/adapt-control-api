import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import multipart from '@fastify/multipart'
import cors from '@fastify/cors'
import 'dotenv/config'

import { appRoutes } from './routes'
import { databaseHealth } from './helpers'
import { env } from './validators'

const app = fastify()

app.register(cors, { origin: '*', methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']})
app.register(multipart)

appRoutes.forEach(route => app.register(route))

app.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.send({
    error: false,
    message: 'API is running 🚀'
  })
})

app.listen({ port: Number(process.env.PORT) || Number(env.APP_PORT), host: "0.0.0.0"})
  .then(async () => {
    await databaseHealth()
    console.log(`Application is running on port: ${env.APP_PORT}`
  )}
)