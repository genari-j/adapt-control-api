import prismaClient from '../../../config/prisma-client'
import { RestRepository } from '../rest-repository'

import { Users, UserByField, UserById } from '../../interfaces/users'

class Repository extends RestRepository {
  async findAllUsers (skip: number, take: number, filters: any): Promise<Users> {
    const whereClause = {
      active: true,
      deleted_at: null,
      ...filters
    }

    const [data, total] = await prismaClient.$transaction([
      prismaClient.users.findMany({
        where: whereClause,
        include: {
          department: true,
          profile: true
        },
        skip,
        take
      }),
      prismaClient.users.count({
        where: whereClause
      })
    ])
    const pages = Math.ceil(total / take)
    const currentPage = Math.ceil(skip / take) + 1

    return {
      data,
      total,
      pages,
      currentPage
    }
  }

  async findUserById (id: number): Promise<UserById | null> {
    const query = await prismaClient.users.findFirst({
      where: { id },
      include: {
        department: true,
        profile: true
      }
    })
    return query
  }

  async findUserByExistingCode (id: number, code: number): Promise<UserByField | null> {
    const query = await prismaClient.users.findFirst({
      where: {
        user_code: code,
        id: {
          not: id
        },
      },
    })
    return query
  }

  async findUserByExistingEmail (id: number, email: string): Promise<UserByField | null> {
    const query = await prismaClient.users.findFirst({
      where: {
        email: email,
        id: {
          not: id
        },
      },
    })
    return query
  }

  async disableUser (id: number): Promise<UserByField | null> {
    const query = await prismaClient.users.update({
      where: { id: id },
      data: { active: false },
    })
    return query
  }
}

const UsersRepository = new Repository('users')

export default UsersRepository