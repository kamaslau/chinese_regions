import fetch from 'node-fetch'
import fs from 'fs-extra'

const fetchSource = async (url: string): Promise<string> => {
  // 验证源数据网址格式
  if (typeof url !== 'string') return ''

  let result: string = ''

  result = await fetch(
    url
  ).then(res => res.text()).catch(error => console.error(error))

  return result
}

export { fetchSource }