import { Router } from '@koa/router'

export const router = new Router()
router.prefix('/city')

// http://localhost:3000/api/city
router.get('/', async (ctx) => {
  const { city: rawData } = ctx.dataset

  ctx.status = 200
  ctx.body = { data: rawData }
})

// http://localhost:3000/api/city/370200/county
router.get('/:id/county', async (ctx) => {
  const id = ctx.params.id

  const { county: rawData } = ctx.dataset
  const data = rawData.filter((item: County) => String(item.c_code) === id)

  ctx.status = 200
  ctx.body = { data, metadata: { cityId: id } }
})
