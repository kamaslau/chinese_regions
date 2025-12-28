// External
import Koa from 'koa'
import Router from '@koa/router'
import fs from 'fs-extra'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Local
import { consoleInit, consoleStart, briefLog } from './utils.js'
import { fetchSource, parseRawHTML, generateJSON } from './processor.js'

const isDev = process.env.NODE_ENV !== 'production'
const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

// 输出程序初始化信息
// console.log('process.env: ', process.env)
consoleInit()

// 创建Koa.js实例
const app = new Koa()

// 简易日志
app.use(briefLog)

// 兜底错误处理
app.on('error', (error, ctx): void => {
  console.error('server error: ', error)

  ctx.status = error.code ?? 501
  ctx.body = { content: error.message }
})

// 创建路由实例
const router = new Router()
app.use(router.routes()).use(router.allowedMethods())

// Category
router.get('/', async (ctx) => {
  ctx.body = {
    api: 'http://localhost:3000/api',
    parse: 'http://localhost:3000/parse'
  }
})

// API(RESTful)
router.get('/api', async (ctx) => {
  const data = await fs.readJSON(join(dirName, '..', 'out', 'all.min.json'))

  ctx.status = 200
  ctx.body = { data }
})

router.get('/api/province', async (ctx) => {
  const { province: rawData } = await fs.readJSON(join(dirName, '..', 'out', 'all.min.json'))

  ctx.status = 200
  ctx.body = { data: rawData }
})

router.get('/api/province/:id', async (ctx) => {
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

  const all = await fs.readJSON(join(dirName, '..', 'out', 'all.min.json'))
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

router.get('/api/province/:id/city', async (ctx) => {
  const id = ctx.params.id

  const { city: rawData } = await fs.readJSON(join(dirName, '..', 'out', 'all.min.json'))
  const data = rawData.filter((item: City) => String(item.p_code) === id)

  ctx.status = 200
  ctx.body = { data, metadata: { provinceId: id } }
})

router.get('/api/city', async (ctx) => {
  const { city: rawData } = await fs.readJSON(join(dirName, '..', 'out', 'all.min.json'))

  ctx.status = 200
  ctx.body = { data: rawData }
})

router.get('/api/county', async (ctx) => {
  const { county: rawData } = await fs.readJSON(join(dirName, '..', 'out', 'all.min.json'))

  ctx.status = 200
  ctx.body = { data: rawData }
})

// 解析源数据并生成文件
router.get('/parse', async (ctx) => {
  let url: URL | undefined
  let errorMessage: string | undefined

  if (typeof process.env.SOURCE_URL !== 'string' || process.env.SOURCE_URL.length === 0) {
    errorMessage = 'SOURCE_URL 未配置'
  } else {
    try {
      url = new URL(process.env.SOURCE_URL)
    } catch (error) {
      errorMessage = 'SOURCE_URL 不符合 URL 格式'
    }
  }

  if (typeof errorMessage === 'string') {
    ctx.status = 400
    ctx.body = { message: errorMessage, figureURL: 'https://http.cat/400' }
    return
  }

  // 请求源数据页面
  const rawData = await fetchSource(url as URL)
  if (typeof rawData !== 'string' || rawData.length === 0) {
    ctx.status = 400
    ctx.body = { data: rawData, figureURL: 'https://http.cat/400' }
    return
  } else {
    isDev && console.log('Source fetched')
    // console.log('rawData: ', rawData)
  }

  // 解析大陆行政区源数据
  const dataset = parseRawHTML(rawData)
  // const dataset: Regions = { province: [], city: [], county: [] }

  // 解析各特别行政区源数据
  const sars: string[] = ['macau', 'hongkong', 'taiwan']
  const readJSON = async (fileName: string): Promise<Regions> => {
    const absolutePath = join(dirName, 'static', `${fileName}.json`)
    const data = await fs.readJSON(absolutePath)
    return data as Regions
  }

  await Promise.all(sars.map(async (file) => {
    await readJSON(file).then((data: Regions) => {
      console.log(
        `${file} contains: `,
        `${data.province?.length ?? 0} provinces`,
        `${data.city?.length ?? 0} cities`,
        `${data.county?.length ?? 0} counties`
      )

      // 合并数据集入 dataset
      data.province?.length > 0 && dataset.province.push(...data.province)
      data.city?.length > 0 && dataset.city.push(...data.city)
      data.county?.length > 0 && dataset.county.push(...data.county)
    }).catch(error => console.error(error))
  }))

  // 生成可用文件
  const files = generateJSON(dataset)

  // 输出业务摘要
  ctx.status = 200
  ctx.body = {
    dataset,
    files
  }
})

const serverPort = process.env.PORT ?? 3000
app.listen(serverPort)

// 输出业务启动信息
consoleStart()
