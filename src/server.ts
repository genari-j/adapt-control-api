import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'

import { appRoutes } from './routes'
import { databaseHealth } from './helpers'
import { env } from './validators'

const app = fastify()

app.register(cors, { origin: '*', methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']})
app.register(fastifyMultipart)

appRoutes.forEach(route => app.register(route))

app.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.send({
    error: false,
    message: 'API is running 🚀'
  })
})

app.listen({ port: Number(env.APP_PORT)})
  .then(async () => {
    await databaseHealth()
    console.log(`Application is running on port: ${env.APP_PORT}`
  )}
)