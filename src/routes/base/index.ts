import type { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'

const baseRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
	fastify.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
		return reply.send({
			error: false,
			message: 'API is running 🚀',
		})
	})
}

export default baseRoute
