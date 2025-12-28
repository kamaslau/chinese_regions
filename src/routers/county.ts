import { Router } from '@koa/router'

export const router = new Router()
router.prefix('/county')

// http://localhost:3000/api/county
router.get('/', async (ctx) => {
  const { county: rawData } = ctx.dataset

  ctx.status = 200
  ctx.body = { data: rawData }
})
