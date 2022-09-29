// External
import fetch from 'node-fetch'
import fs from 'fs-extra'
import * as cheerio from 'cheerio'

const fetchSource = async (url: string): Promise<string> => {
  // 验证源数据网址格式
  if (typeof url !== 'string') return ''

  let result: string = ''

  result = await fetch(
    url
  ).then(res => res.text()).catch(error => console.error(error))

  return result
}

const parseRawHTML = (raw: string): string => {
  const $ = cheerio.load(raw, null, false)
  let result: string = ''
  $('tr[height=19]').each(function () {
    result += $(this).text()
  })
  return result
}

export { fetchSource, parseRawHTML }