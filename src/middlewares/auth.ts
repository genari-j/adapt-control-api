import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

import { env } from '../validators'

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
	const bearerToken = request.headers.authorization

	if (!bearerToken) {
		return reply.status(401).send({
			error: true,
			message: 'Não autorizado!',
		})
	}

	const [, token] = bearerToken.split(' ')

	try {
		jwt.verify(token, env.APP_SECRET as string)
		return
	} catch (error) {
		return reply.status(401).send({
			error: true,
			message: 'Não autorizado!',
		})
	}
}
