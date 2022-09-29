// External
import 'dotenv/config' // 载入.env环境配置文件
import Koa from 'koa'

// Local
import { consoleInit, consoleStart, briefLog } from './utils'
import { fetchSource } from './processor'

// 输出程序初始化信息
console.log('process.env: ', process.env)
consoleInit()

const isDev = process.env.NODE_ENV !== 'production'

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

// TODO 业务路由
app.use(async (ctx, next) => {

  // 请求源数据页面
  const rawData = await fetchSource(process.env.SOURCE_URL ?? '')
  if (typeof rawData !== 'string') {
    ctx.status = 400
    ctx.body = { data: rawData, figureURL: 'https://http.cat/400' }
  } else {
    ctx.status = 200
    ctx.body = rawData
  }

  // TODO 解析源数据

  // TODO 生成可用文件
})

const serverPort = process.env.PORT ?? 3000
app.listen(serverPort)

// 输出业务启动信息
consoleStart()
