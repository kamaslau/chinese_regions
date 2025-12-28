import { Router } from '@koa/router'
import fs from 'fs-extra'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

export const router = new Router()
router.prefix('/county')

router.get('/', async (ctx) => {
  const { county: rawData } = await fs.readJSON(join(dirName, '..', '..', 'out', 'all.min.json'))

  ctx.status = 200
  ctx.body = { data: rawData }
})
