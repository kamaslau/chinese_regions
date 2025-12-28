import { Router } from '@koa/router'

export const router = new Router()
router.prefix('/province')

// http://localhost:3000/api/province
router.get('/', async (ctx) => {
  const { province: rawData } = ctx.dataset
  ctx.status = 200
  ctx.body = { data: rawData }
})

router.get('/:id', async (ctx) => {
  const id = ctx.params.id

  const result: APIResponse = {
    metadata: { id },
    data: []
  }

  let memoryRecorder: APIResponse['memory'] | undefined
  if (process.env.NODE_ENV !== 'production') {
    memoryRecorder = { before: undefined, afterRead: undefined, afterFilter: undefined }
    result.memory = memoryRecorder

    memoryRecorder.before = {
      rss: Math.round(process.memoryUsage().rss / 1024), // kB
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024)
    }
  }

  const all = ctx.dataset
  const { province: rawData } = all
  if (memoryRecorder !== undefined) {
    memoryRecorder.afterRead = {
      rss: Math.round(process.memoryUsage().rss / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024)
    }
  }

  result.data = rawData.filter((item: Province) => String(item.code) === id)
  if (memoryRecorder !== undefined) {
    memoryRecorder.afterFilter = {
      rss: Math.round(process.memoryUsage().rss / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024)
    }
  }

  ctx.status = 200
  ctx.body = result
})

// http://localhost:3000/api/province/370000/city
router.get('/:id/city', async (ctx) => {
  const id = ctx.params.id

  const { city: rawData } = ctx.dataset
  const data = rawData.filter((item: City) => String(item.p_code) === id)

  ctx.status = 200
  ctx.body = { data, metadata: { provinceId: id } }
})
