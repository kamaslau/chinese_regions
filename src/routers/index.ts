import { Router } from '@koa/router'
import { router as provinceRouter } from './province.js'
import { router as cityRouter } from './city.js'
import { router as countyRouter } from './county.js'

export const router = new Router()
router.prefix('/api')

router.get('/', async (ctx) => {
  const data = ctx.dataset

  ctx.status = 200
  ctx.body = { data }
})

router.use(provinceRouter.routes(), provinceRouter.allowedMethods())
router.use(cityRouter.routes(), cityRouter.allowedMethods())
router.use(countyRouter.routes(), countyRouter.allowedMethods())
