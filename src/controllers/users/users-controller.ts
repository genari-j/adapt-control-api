import { FastifyRequest, FastifyReply } from 'fastify'

import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import path from 'path'
import fs from 'node:fs'
import { mailService } from '../../services'
import { cryptPassword } from '../../helpers'

import { CreateUser, UsersRepository } from '../../models/interfaces/users'
import { DepartmentsRepository } from '../../models/interfaces/departments'
import { ProfilesRepository } from '../../models/interfaces/profiles'
import { ProfilePermissionsRepository } from '../../models/interfaces/profile-permissions'

import {
  env,
  signInBodySchema,
  signUpBodySchema,
  updateUserBodySchema,
  solResetPasswordSchema,
  bearerTokenSchema,
  confirmNewPswSchema,
  userParamsSchema,
  userQuerySchema,
} from '../../validators'

export class UsersController {
  private readonly usersRepository: UsersRepository
  private readonly departmentsRepository: DepartmentsRepository
  private readonly profilesRepository: ProfilesRepository
  private readonly profilePermissionsRepository: ProfilePermissionsRepository

  constructor (
    usersRepository: UsersRepository,
    departmentsRepository: DepartmentsRepository,
    profilesRepository: ProfilesRepository,
    profilePermissionsRepository: ProfilePermissionsRepository
  ) {
    this.usersRepository = usersRepository
    this.departmentsRepository = departmentsRepository
    this.profilesRepository = profilesRepository
    this.profilePermissionsRepository = profilePermissionsRepository
  }

  async verifyToken (_request: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.status(200).send({
        error: false,
        message: 'Requisição validada.'
      })

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }

  async updateUserPassword (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { authorization } = request.headers
      const bearerToken = bearerTokenSchema.parse(authorization?.replace('Bearer ', ''))
      const result = jwt.verify(bearerToken, env.APP_SECRET as string)

      const { sub } = result
      const { password, confirmPassword } = confirmNewPswSchema.parse(request.body)
      const user = await this.usersRepository.findOneBy('id', Number(sub))

      if (!user) { return reply.status(404).send({ error: true, message: 'O Usuário especificado não foi encontrado.' }) }
      if (password !== confirmPassword) { return reply.status(400).send({ error: true, message: 'As senhas especificadas não conferem.' }) }
      if (password.length < 6) { return reply.status(400).send({ error: true, message: 'A senha deve conter no mínimo 6 caracteres.' }) }

      const encryptedPassword = await cryptPassword(password)
      const payload = { password: encryptedPassword }
      await this.usersRepository.findByIdAndUpdate(Number(sub), payload)

      return reply.status(200).send({
        error: false,
        message: 'A senha foi atualizada.'
      })

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }

  async solicitationResetPassword (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = solResetPasswordSchema.parse(request.body)

      const userByEmail = await this.usersRepository.findOneBy('email', email)
      if (!userByEmail) { reply.status(404).send({ error: true, message: 'O E-mail especificado não foi encontrado.' }) }

      const token = jwt.sign(
        { sub: userByEmail.id },
        env.APP_SECRET as string,
        {expiresIn: env.EXP_RESET_PSW as string}
      )

      const emailPath = path.resolve(__dirname, '..', '..', 'services', 'emails', 'templates', 'sol-reset-psw.html')
      const [userFirstName] = userByEmail.name.split(' ')

      const html = fs.readFileSync(emailPath, { encoding: 'utf-8' })
        .replace('{{ emailLink }}', `${env.URL_FRONTEND}?token=${token}`)
        .replace('{{ name }}', userFirstName)

      await mailService(email, 'Adapt Control - Recuperação de Senha', html)

      return reply.status(200).send({
        error: false,
        message: 'Um e-mail de recuperação de senha foi enviado.'
      })

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }

  async login (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { user_code, password } = signInBodySchema.parse(request.body)

      const user = await this.usersRepository.findOneBy('user_code', user_code)

      if (!user || user.active !== true || user.deleted_at !== null) {
        return reply.status(401).send({
          error: true,
          message: 'Não autorizado.'
        })
      }

      const compareUserPassword = await bcryptjs.compare(String(password), String(user.password))
      if (!compareUserPassword) { return reply.status(401).send({ error: true, message: 'Não autorizado.' }) }

      const profiles = await this.profilePermissionsRepository.findByProfileId(user.profile_id)
      const departments = await this.departmentsRepository.findOneBy('id', user.department_id)

      const token = jwt.sign(
        {
          sub: user.id,
          name: user.name,
          user_code: user.user_code,
          email: user.email,
          departments,
          profiles,
          active: user.active,
          avatar: user.avatar,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        env.APP_SECRET as string,
        {expiresIn: '12h'}
      )

      return reply.status(200).send({
        error: false,
        data: { token }
      })

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }

  async create (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, user_code, email, password, department_id, profile_id } = signUpBodySchema.parse(request.body)

      const userByCode = await this.usersRepository.findOneBy('user_code', user_code)
      if (userByCode) { return reply.status(400).send({ error: true, message: 'O código informado já existe.' }) }

      const userByEmail = await this.usersRepository.findOneBy('email', email)
      if (userByEmail) { return reply.status(400).send({ error: true, message: 'Erro ao utilizar este email.' }) }

      const departmentById = await this.departmentsRepository.findOneBy('id', department_id)
      if (!departmentById) { return reply.status(404).send({ error: true, message: 'O departamento informado não existe.' }) }

      const profileById = await this.profilesRepository.findOneBy('id', profile_id)
      if (!profileById) { return reply.status(404).send({ error: true, message: 'O perfil informado não existe.' }) }

      const encryptedPassword = await cryptPassword(password)

      const payload: CreateUser = {
        name,
        user_code,
        email,
        password: encryptedPassword,
        department_id,
        profile_id
      }
      const userCreated = await this.usersRepository.create(payload)

      return reply.status(201).send({
        error: false,
        data: userCreated
      })

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }

  async getAll (request: FastifyRequest, reply: FastifyReply) {
    try {
      const page = Number((request.query as { page?: string }).page) || Number(env.INITIAL_DATA_OFFSET)
      const limit = Number((request.query as { limit?: string }).limit) || Number(env.LIST_PER_PAGE)
      const skip = (page - 1) * limit

      const { name } = userQuerySchema.parse(request.query)
      const filters = { name }

      const { data, total, pages, currentPage } = await this.usersRepository.findAllUsers(skip, limit, filters)

      const mappedUsers = data?.map((user) => {
        return {
          id: user.id,
          name: user.name,
          user_code: user.user_code,
          email: user.email,
          profile: {
            id: user.profile_id,
            name: user.profile.name,
            description: user.profile.description,
            active: user.profile.active,
            created_at: user.profile.created_at,
            updated_at: user.profile.updated_at
          },
          department: {
            id: user.department_id,
            name: user.department.name,
            active: user.department.active,
            created_at: user.department.created_at,
            updated_at: user.department.updated_at
          },
          avatar: user.avatar,
          active: user.active,
          created_at: user.created_at,
          updated_at: user.updated_at,
          deleted_at: user.deleted_at
        }
      })

      return reply.status(200).send({
        error: false,
        data: mappedUsers,
        limit,
        total,
        pages,
        currentPage
      })

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }

  async getById (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = userParamsSchema.parse(request.params)

      const userById = await this.usersRepository.findUserById(Number(id))
      if (!userById) { return reply.status(404).send({ error: true, message: 'O Colaborador especificado não existe.' }) }

      const user = {
        user: {
          id: userById.id,
          name: userById.name,
          user_code: userById.user_code,
          email: userById.email,
          department: {
            id: userById.department.id,
            name: userById.department.name
          },
          profile: {
            id: userById.profile.id,
            name: userById.profile.name
          },
          active: userById.active,
          avatar: userById.avatar,
          created_at: userById.created_at,
          updated_at: userById.updated_at,
          deleted_at: userById.deleted_at
        }
      }

      return reply.status(200).send({
        error: false,
        data: user
      })

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }

  async update (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = userParamsSchema.parse(request.params)
      const { name, user_code, email, department_id, profile_id, active, avatar } = updateUserBodySchema.parse(request.body)
      console.log('ID:', id)
      console.log('DADOS:', name, user_code, email, department_id, profile_id, active, avatar)

      // const userById = await this.usersRepository.findUserById(Number(id))
      // if (!userById) { return reply.status(404).send({ error: true, message: 'O usuário informado não existe.' }) }

      // const payload: any = {}

      // if (name) { payload.name = name }

      // if (user_code) {
      //   const userByCode = await this.usersRepository.findUserByExistingCode(Number(id), user_code)
      //   if (userByCode) { return reply.status(400).send({ error: true, message: 'O código informado já existe.' }) }
      //   payload.user_code = user_code
      // }

      // if (email) {
      //   const userByEmail = await this.usersRepository.findUserByExistingEmail(Number(id), email)
      //   if (userByEmail) { return reply.status(400).send({ error: true, message: 'O email informado já existe.' }) }
      //   payload.email = email
      // }

      // if (department_id) {
      //   const [departmentById] = await this.departmentsRepository.findOneBy('id', department_id)
      //   if (!departmentById) { return reply.status(404).send({ error: true, message: 'O departamento informado não existe.' }) }
      //   payload.department_id = department_id
      // }

      // // Verificar como aplicar essa atualização somente pra gestor e acima de gestor
      // if (profile_id) {
      //   const [profileById] = await this.profilesRepository.findOneBy('id', profile_id)
      //   if (!profileById) { return reply.status(404).send({ error: true, message: 'O perfil informado não existe.' }) }
      //   payload.profile_id = profile_id
      // }

      // if (active || String(active) === '0') { payload.active = active }

      // if (Object.keys(payload).length) {
      //   await this.usersRepository.findByIdAndUpdate(Number(id), payload)
      // }

      // return reply.status(200).send({
      //   error: false,
      //   message: 'O usuário foi atualizado.'
      // })

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }

  async delete (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = userParamsSchema.parse(request.params)

      if (!id) { return reply.status(400).send({ error: true, message: 'ID do usuário não informado.' }) }

      const user = await this.usersRepository.findOneBy('id', Number(id))
      if (!user) { return reply.status(404).send({ error: true, message: 'O usuário informado não existe.' }) }

      await this.usersRepository.disableUser(Number(id))
      return reply.status(204).send()

    } catch (err) {
      reply.status(500).send(`Algo saiu como não esperado: ${err}`)
    }
  }
}