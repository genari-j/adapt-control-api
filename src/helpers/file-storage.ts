import multer from 'fastify-multer'

export const createStorage = (destinationPath: string) => {
  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, destinationPath)
    },
    filename: function (_req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  const upload = multer({ storage: storage })
  return upload
}