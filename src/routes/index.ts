import baseRoute from './base'
import categoriesRoutes from './categories'
import departmentsRoutes from './departments'
import paymentsRoutes from './payments'
import productsRoutes from './products'
import profilesRoutes from './profiles'
import salesRoutes from './sales'
import usersRoutes from './users'

export const appRoutes = [
	baseRoute,
	departmentsRoutes,
	usersRoutes,
	profilesRoutes,
	categoriesRoutes,
	productsRoutes,
	paymentsRoutes,
	salesRoutes,
]
