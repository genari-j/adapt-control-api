import multer from 'fastify-multer'

export const createStorage = (destinationPath: string) => {
  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, `${destinationPath}/tmp`)
    }
  })

  const upload = multer({
    dest: `${destinationPath}/tmp`,
    storage: storage
  })

  return upload
}

export const productsPath = './src/uploads/products'
export const usersPath = './src/uploads/users'