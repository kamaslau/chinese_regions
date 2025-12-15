// External
import fs from 'fs-extra'
import * as cheerio from 'cheerio'

// Local
import path from 'node:path'

/**
 * 获取源数据
 * @param {string} url
 * @returns {string}
 */
const fetchSource = async (url: URL): Promise<string> => {
  // 验证源数据网址格式
  if (typeof url !== 'string') return ''

  const result = await fetch(
    url
  ).then(async res => await res.text()).catch(error => console.error(error))

  return result ?? ''
}

/**
 * 解析源数据为目标数据集
 * @param payload
 * @returns
 */
const parseRawHTML = (payload: string): Regions => {
  // 当前省、市、区/县级行政区
  let province: Province,
    city: City,
    county: County

  // 上一条数据行政层级
  let lastLevel: 'province' | 'city' | 'county'

  // 最终数据集
  const dataset: Regions = {
    province: [],
    city: [],
    county: []
  }

  const $ = cheerio.load(payload, null, false)

  // 处理单条数据
  $('tr[height=19]').each(function () {
    const tds = $(this).find('td')
    if (tds.length === 0) return

    const item: RegionItem = {
      code: Number(tds.eq(1).text().trim()), // 代码
      name: tds.eq(2).text().trim() // 名称
    }
    const isProvince = String(item.code).lastIndexOf('0000') === 2
    const isCity = !isProvince && String(item.code).lastIndexOf('00') === 4
    const isCounty = !isProvince && !isCity
    // process.env.NODE_ENV === 'development' && console.log('item: ', item, isProvince, isCity, isCounty)

    // 按层级执行不同业务
    if (isProvince) {
      // 若为直辖市、SAR下一条记录，同时补录上一条的市、区级记录
      if (lastLevel === 'province') {
        // console.log('province under province, current: ', item)
        city = {
          p_code: province.code,
          p_name: province.name,
          ...province
        }
        // console.log('province under province, append city: ', city)
        dataset.city.push(city)

        county = {
          p_code: province.code,
          p_name: province.name,
          c_code: province.code,
          c_name: province.name,
          ...province
        }
        // console.log('province under province, append county: ', county)
        dataset.county.push(county)
      }

      // 省级
      province = {
        ...item
      }
      dataset.province.push(province)
      lastLevel = 'province'

      // 一并重置市级记录以兼容直辖市
      city = {
        p_code: item.code,
        p_name: item.name,
        ...item
      }
    } else if (isCity) {
      // 市级
      city = {
        p_code: province.code,
        p_name: province.name,
        ...item
      }
      dataset.city.push(city)
      lastLevel = 'city'
    } else if (isCounty) {
      // 若为直辖市、SAR下一条记录，同时补录上一条的市级记录
      if (lastLevel === 'province') {
        // console.log('county under province, append city: ', city)
        dataset.city.push(city)
      }

      // 区县级
      county = {
        p_code: province.code,
        p_name: province.name,
        c_code: city.code,
        c_name: city.name,
        ...item
      }
      dataset.county.push(county)
      lastLevel = 'county'
    } else {
      console.error('异常数据: ', item)
    }
  })

  return dataset
}

const generateJSON = (payload: Regions, dir: string = 'out', fileName: string = 'all'): any => {
  const targetDir = path.join(path.resolve(), dir)
  const paths = {
    minified: path.join(targetDir, `${fileName}.min.json`)
  }
  fs.writeJSONSync(paths.minified, payload)

  return paths
}

export { fetchSource, parseRawHTML, generateJSON }
