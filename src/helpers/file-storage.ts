import multer from 'fastify-multer'

export const createStorage = (destinationPath: string) => {
  return multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, destinationPath)
    },
    filename: function (_req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
}

export const userStorage = createStorage('./src/uploads/users')
export const productStorage = createStorage('./src/uploads/products')