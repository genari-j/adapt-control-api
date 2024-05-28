import { FastifyRequest, FastifyReply } from 'fastify'

import { DepartmentsRepository } from '../../models/interfaces/departments'

import { env, departmentsQuerySchema } from '../../validators'

export class DepartmentsController {
  private readonly departmentsRepository: DepartmentsRepository

  constructor (departmentsRepository: DepartmentsRepository) {
    this.departmentsRepository = departmentsRepository
  }

  async getAll (request: FastifyRequest, reply: FastifyReply) {
    try {
      const page = Number((request.query as { page?: string }).page) || Number(env.INITIAL_DATA_OFFSET)
      const limit = Number((request.query as { limit?: string }).limit) || Number(env.LIST_PER_PAGE)
      const skip = (page - 1) * limit

      const { name } = departmentsQuerySchema.parse(request.query)
      const filters = { name }

      const [departments, total, totalPage, currentPage] = await this.departmentsRepository.findAll(skip, limit, filters)

      return reply.status(200).send({
        error: false,
        data: departments,
        limit,
        total,
        totalPage,
        currentPage
      })

    } catch (err) {
      return reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }
}