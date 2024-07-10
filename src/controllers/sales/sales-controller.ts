import { FastifyRequest, FastifyReply } from 'fastify'

import { CreateSale, SalesRepository } from '../../models/interfaces/sales'
import { PaymentsRepository } from '../../models/interfaces/payments'
import { SalesRelationshipProduct, SalesRelationshipProductRepository } from '../../models/interfaces/sales-relationship-product'
import { UpdateProduct, ProductsRepository } from '../../models/interfaces/products'

import { env, newSaleSchema, saleQuerySchema } from '../../validators'
import Decimal from 'decimal.js'

export class SalesController {
  private readonly salesRepository: SalesRepository
  private readonly paymentsRepository: PaymentsRepository
  private readonly salesRelationshipProductRepository: SalesRelationshipProductRepository
  private readonly productsRepository: ProductsRepository

  constructor (
    salesRepository: SalesRepository,
    paymentsRepository: PaymentsRepository,
    salesRelationshipProductRepository: SalesRelationshipProductRepository,
    productsRepository: ProductsRepository
  ) {
    this.salesRepository = salesRepository
    this.paymentsRepository = paymentsRepository
    this.salesRelationshipProductRepository = salesRelationshipProductRepository
    this.productsRepository = productsRepository
  }

  async getAll (request: FastifyRequest, reply: FastifyReply) {
    try {
      const page = Number((request.query as { page?: string }).page) || Number(env.INITIAL_DATA_OFFSET)
      const limit = Number((request.query as { limit?: string }).limit) || Number(env.LIST_PER_PAGE)
      const skip = (page - 1) * limit

      const { payment, date } = saleQuerySchema.parse(request.query)
      const filters = { payment, date }

      const { data, total, pages, currentPage } = await this.salesRepository.findAllSales(skip, limit, filters)

      const mappedSales = data?.map((sale) => {
        return {
          id: sale.id,
          total: sale.total,
          payment: {
            id: sale.payment.id,
            name: sale.payment.name,
            active: sale.payment.active,
            created_at: sale.payment.created_at,
            updated_at: sale.payment.updated_at,
            deleted_at: sale.payment.deleted_at
          },
          sale_relationship_product: sale.Sale_relationship_product.map((relation) => {
            return relation
          }),
          sale_date: sale.sale_date,
          created_at: sale.created_at,
          updated_at: sale.updated_at,
          deleted_at: sale.deleted_at
        }
      })

      return reply.status(200).send({
        error: false,
        data: mappedSales,
        limit,
        total,
        pages,
        currentPage
      })

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }

  async create (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { payment_id, sale_date, products } = newSaleSchema.parse(request.body)

      const paymentById = await this.paymentsRepository.findOneBy('id', payment_id)
      if (!paymentById) { return reply.status(404).send({ error: true, message: 'O método de pagamento não existe.' }) }

      let totalSale = 0

      for(const product of products) {
        const productExists = await this.productsRepository.findOneBy('id', product.id)
        if (!productExists) {
          return reply.status(404).send({
            error: true,
            message: 'Um ou mais produtos especificados não existem.'
          })
        }

        const updateProductQuantity: UpdateProduct = {
          quantity: productExists.quantity - product.amount
        }
        await this.productsRepository.findByIdAndUpdate(Number(productExists.id), updateProductQuantity)
        totalSale += Number(productExists.price) * product.amount;
      }

      const totalDecimal = new Decimal(totalSale)
      const salePayload: CreateSale = {
        total: totalDecimal,
        payment_id: Number(paymentById.id),
        sale_date
      }
      const saleCreated = await this.salesRepository.create(salePayload)

      for (const product of products) {
        const saleRelationshipProductPayload: SalesRelationshipProduct = {
          sale_id: Number(saleCreated.id),
          product_id: product.id,
          amount_product: product.amount
        }
        await this.salesRelationshipProductRepository.create(saleRelationshipProductPayload)
      }

      return reply.status(201).send({
        error: false,
        data: saleCreated
      })

    } catch (err) {
      return reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }
}