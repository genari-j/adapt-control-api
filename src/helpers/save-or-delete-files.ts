import fs from 'node:fs'

export const deleteTmpFile = (filePath: string): void => {
  fs.unlink(filePath, (err) => {
    if (err) console.log(err)
  })
}

export const saveFile = async (oldPath: string, newPath: string): Promise<void> => {
  await fs.rename(oldPath, newPath, (err) => {
    if (err) console.log(err)
  })
}