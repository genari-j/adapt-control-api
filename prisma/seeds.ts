import { checkingDBToInsertSeeds } from '../src/helpers'

async function execSeeds() {
	// STARTING
	console.table('Iniciando a inserção das seeds 😊')

	// DEPARTMENTS
	const departments = [
		{ name: 'Direção' },
		{ name: 'Recursos Humanos' },
		{ name: 'Tecnologia da Informação' },
		{ name: 'Segurança do Trabalho' },
		{ name: 'Financeiro' },
	]
	await checkingDBToInsertSeeds(departments, 'department', 'name')
	console.table('Departamentos inseridos com sucesso.')

	/* -------------------------------------------------------------------------------- */

	// PROFILES
	const profiles = [
		{ name: 'Admin', description: 'Poderá executar todas operações do sistema' },
		{ name: 'Gestor de área', description: 'Poderá visualizar todas informações e realizar novos cadastros' },
		{ name: 'Colaborador', description: 'Poderá apenas visualizar todas informações' },
	]
	await checkingDBToInsertSeeds(profiles, 'profile', 'name')
	console.table('Perfis inseridos com sucesso.')

	/* -------------------------------------------------------------------------------- */

	// PROFILE PERMISSIONS
	const profilePermissions = [
		{ code: 'ADM', description: 'Poderá executar todas operações do sistema', profiles: '1' },
		{ code: 'GA', description: 'Poderá visualizar todas informações e realizar novos cadastros', profiles: '2' },
		{ code: 'FUN', description: 'Poderá apenas visualizar todas informações', profiles: '3' },
	]
	await checkingDBToInsertSeeds(profilePermissions, 'profile_permission', 'code')
	console.table('Permissões dos perfis inseridas com sucesso.')

	/* -------------------------------------------------------------------------------- */

	// USERS
	const users = [
		{
			name: 'ADM',
			user_code: 4187,
			email: 'admin@hotmail.com',
			password: '$2b$10$kn4U6jwJgNQkbzHsM.1d7OIlq6VucVBvRuz88hjToDNNTHWcV81Xa',
			department_id: 1,
			profile_id: 1,
		},
		{
			name: 'GA',
			user_code: 4188,
			email: 'manager@hotmail.com',
			password: '$2b$10$kn4U6jwJgNQkbzHsM.1d7OIlq6VucVBvRuz88hjToDNNTHWcV81Xa',
			department_id: 2,
			profile_id: 2,
		},
		{
			name: 'FUN',
			user_code: 4189,
			email: 'colaborator@hotmail.com',
			password: '$2b$10$kn4U6jwJgNQkbzHsM.1d7OIlq6VucVBvRuz88hjToDNNTHWcV81Xa',
			department_id: 3,
			profile_id: 3,
		},
	]
	await checkingDBToInsertSeeds(users, 'users', 'user_code')
	console.table('Usuários inseridos com sucesso.')

	/* -------------------------------------------------------------------------------- */

	// CATEGORIES
	const categories = [
		{ name: 'Frutas e Vegetais', description: 'Esta categoria inclui uma variedade de frutas e vegetais frescos' },
		{
			name: 'Carnes e Peixes',
			description: 'Produtos como carne de res, suíno, aves e peixes são comumente encontrados nesta categoria',
		},
		{
			name: 'Produtos Lácteos',
			description: 'Inclui leite, iogurte, queijo, manteiga e outros produtos derivados da lactose',
		},
		{
			name: 'Alimentícios Prontos',
			description:
				'Produtos como salgadinhos, congelados, doces e outros alimentos que não requerem preparação antes do consumo',
		},
		{ name: 'Produtos de Panificação', description: 'Inclui pães, bolos, massas e outros produtos de panificação' },
		{
			name: 'Produtos de Limpeza',
			description: 'Produtos de limpeza doméstica, cuidados pessoais e produtos de higiene',
		},
		{ name: 'Produtos Não Alimentares', description: 'Roupas, eletrônicos, artigos de decoração, entre outros' },
		{ name: 'Bebidas Alcoólicas', description: 'Vinhos, cervejas, whisky, vodka, tequila, entre outros' },
		{ name: 'Bebidas Não Alcoólicas', description: 'Água, refrigerantes, sucos naturais, chás, entre outros' },
	]
	await checkingDBToInsertSeeds(categories, 'categories', 'name')
	console.table('Categorias inseridas com sucesso.')

	/* -------------------------------------------------------------------------------- */

	// PRODUCTS
	const products = [
		{
			name: 'Coca-Cola Sem Açúcar 200ml',
			description: 'Refrigerante Coca-Cola Sem Açúcar Pet 200 ml.',
			quantity: 65,
			price: 1.09,
			category_id: 9,
		},
		{
			name: 'Sabão em Pó Tixan Ypê 800g',
			description: 'Sabão em Pó Concentrado Tixan Ypê Green 800g.',
			quantity: 52,
			price: 13.87,
			category_id: 6,
		},
		{
			name: 'Fralda Descart. Pampers XXG 52uni.',
			description: 'Pacote de fraldas descartáveis XXG Confort com 52 unidades.',
			quantity: 98,
			price: 94.0,
			category_id: 6,
		},
	]
	await checkingDBToInsertSeeds(products, 'product', 'name')
	console.table('Produtos inseridos com sucesso.')

	/* -------------------------------------------------------------------------------- */

	// PAYMENTS
	const payments = [
		{ name: 'Dinheiro' },
		{ name: 'PIX' },
		{ name: 'Cartão de Débito' },
		{ name: 'Cartão de Crédito' },
		{ name: 'Vale Alimentação' },
		{ name: 'Vale Presente' },
		{ name: 'Boleto Bancário' },
		{ name: 'Transferência Bancária' },
		{ name: 'Crediário' },
		{ name: 'Carteiras Digitais' },
	]
	await checkingDBToInsertSeeds(payments, 'payment', 'name')
	console.table('Métodos de pagamentos inseridos com sucesso.')

	/* -------------------------------------------------------------------------------- */

	// SALES
	const sales = [
		{
			total: 5.45,
			payment_id: 4,
			sale_date: new Date(),
		},
		{
			total: 27.74,
			payment_id: 2,
			sale_date: new Date(),
		},
		{
			total: 188,
			payment_id: 1,
			sale_date: new Date(),
		},
	]
	await checkingDBToInsertSeeds(sales, 'sale', 'total')
	console.table('Vendas inseridas com sucesso.')

	/* -------------------------------------------------------------------------------- */

	// SALE RELATIONSHIP PRODUCT
	const sale_relationship_product = [
		{ sale_id: 1, product_id: 1, amount_product: 5 },
		{ sale_id: 2, product_id: 2, amount_product: 2 },
		{ sale_id: 3, product_id: 3, amount_product: 2 },
	]
	await checkingDBToInsertSeeds(sale_relationship_product, 'sale_relationship_product', 'sale_id')
	console.table('Relação de vendas com produtos inseridas com sucesso.')

	// FINISHING
	console.table('Finalização da inserção das seeds 😁')
}

execSeeds()
