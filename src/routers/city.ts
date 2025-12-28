import { Router } from '@koa/router'
import fs from 'fs-extra'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

export const router = new Router()
router.prefix('/city')

// http://localhost:3000/api/city
router.get('/', async (ctx) => {
  const { city: rawData } = await fs.readJSON(join(dirName, '..', '..', 'out', 'all.min.json'))

  ctx.status = 200
  ctx.body = { data: rawData }
})

// http://localhost:3000/api/city/370200/county
router.get('/:id/county', async (ctx) => {
  const id = ctx.params.id

  const { county: rawData } = await fs.readJSON(join(dirName, '..', '..', 'out', 'all.min.json'))
  const data = rawData.filter((item: County) => String(item.c_code) === id)

  ctx.status = 200
  ctx.body = { data, metadata: { cityId: id } }
})
