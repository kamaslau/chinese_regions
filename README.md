# chinese_regions

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![GitHub top language](https://img.shields.io/github/languages/top/kamaslau/chinese_regions)
![Node Current](https://img.shields.io/node/v/chinese_regions)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/kamaslau/chinese_regions)
![Last Github Commit](https://img.shields.io/github/last-commit/kamaslau/chinese_regions)
![Repository size](https://img.shields.io/github/repo-size/kamaslau/chinese_regions?color=56BEB8)
![npm](https://img.shields.io/npm/v/chinese_regions)
![NPM Downloads](https://img.shields.io/npm/d18m/chinese_regions)
![GitHub Repo stars](https://img.shields.io/github/stars/kamaslau/chinese_regions)

中华人民共和国民政部区划地名司官方公布的行政区划信息数据，含省/直辖市/特别行政区、市、区/县级行政区划代码及名称；[香港、澳门、台湾等地区](#关于港澳台地区)数据均已精确到区/县级别。

当前数据最后更新于 2026 年 02 月 20 日，根据[中华人民共和国民政部于 2025 年 04 月 25 日最新发布的数据](https://www.mca.gov.cn/mzsj/xzqh/2025/202401xzqh.html)生成，一般为发生某地（或数地）行政区划调整后进行相应更新，如撤并、县改区、市直辖等。对于具体行政区划变更情况，可参见[更新日志](./CHANGE_LOG.md)

## 应用场景

为提高全栈开发效率，可将将此库部署到自建 NPM 注册源。

### 前端开发

适用于级联选择器等组件，推荐部署到 CDN。

1. 输出并选择 province 键下的省级行政区
2. 根据 province 值输出 city 键下的市级行政区
3. 根据 city 值输出 county 键下的区/县级行政区

### 后端开发

适用于查询构建器等业务

1. 保存数据到缓存层、持久层，或部署到组件库进行调用

## 使用说明

以使用 PNPM 作为包管理器为例：

### A. 数据包模式

```bash
pnpm add chinese_regions
```

```typescript
import Regions from "chinese_regions" with { type: "json" };
console.log(
  `${Regions.province?.length ?? 0} provinces, `,
  `${Regions.city?.length ?? 0} cities, `,
  `${Regions.county?.length ?? 0} counties, `,
  "loaded from package chinese_regions",
);
```

#### Next.js/React.js 组件示例

```json title="./package.json"
{
  "dependencies": {
    "tailwindcss": "^4.2.0"
  }
}
```

```typescript title="./src/components/RegionSelector.tsx"
// RegionSelector.tsx
// Author: Lau, Kamas
// CreatedAt: 2026-02-20
// Use with:
// import RegionSelector from "@/components/RegionSelector";
// <RegionSelector />

"use client";

import { useState, useMemo } from "react";
import { province, city, county } from "chinese_regions" with { type: "json" }; // https://www.npmjs.com/package/chinese_regions

export default function RegionSelector() {
  console.log(
    `${province.length ?? 0} provinces, `,
    `${city.length ?? 0} cities, `,
    `${county.length ?? 0} counties, `,
    "loaded from package chinese_regions",
  );

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");

  // 市选项：根据省筛选
  const cityOptions = useMemo(() => {
    if (!selectedProvince) return [];
    const code = Number(selectedProvince);
    return (city ?? []).filter((item) => item.p_code === code);
  }, [selectedProvince]);

  // 县选项：根据市筛选，没有选市时返回空数组
  const countyOptions = useMemo(() => {
    if (!selectedCity) return [];
    const code = Number(selectedCity);
    const filtered = (county ?? []).filter((item) => item.c_code === code);
    // 排序：区 → 市 → 县 → 旗
    return filtered.sort((a, b) => {
      const order: Record<string, number> = { 区: 1, 市: 2, 县: 3, 旗: 4 };
      return (order[a.name.slice(-1)] || 99) - (order[b.name.slice(-1)] || 99);
    });
  }, [selectedCity]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProvince(value);
    setSelectedCity("");
    setSelectedCounty("");
    console.log("province selected: ", value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCity(value);
    setSelectedCounty("");
    console.log("city selected: ", value);
  };

  const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCounty(value);
    console.log("county selected: ", value);
  };

  if (!province.length || !city.length || !county.length) {
    return <div className="text-red-500">Failed to load region data.</div>;
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">选择地区</legend>

      <div className="w-full md:w-1/2 flex items-center justify-between gap-4">
        <div className="input-group flex-1 my-0!">
          <label htmlFor="province">省</label>

          <select
            name="province"
            id="province"
            className="w-full border rounded px-2 py-1"
            required
            onChange={handleProvinceChange}
          >
            <option key="province-default" selected={selectedProvince === ""}>
              请选择
            </option>

            {province.map((item, index) => {
              return (
                <option key={`province-${index}`} value={item.code}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="input-group flex-1 my-0!">
          <label htmlFor="city">市</label>

          <select
            name="city"
            id="city"
            className="w-full border rounded px-2 py-1"
            required
            disabled={!selectedProvince}
            onChange={handleCityChange}
          >
            <option key="city-default" selected={selectedCity === ""}>
              请选择
            </option>

            {cityOptions.map((item, index) => {
              return (
                <option key={`city-${index}`} value={item.code}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="input-group flex-1 my-0!">
          <label htmlFor="county">区/县</label>

          <select
            name="county"
            id="county"
            className="w-full border rounded px-2 py-1"
            required
            disabled={!selectedCity}
            onChange={handleCountyChange}
          >
            <option key="county-default" selected={selectedCounty === ""}>
              请选择
            </option>

            {countyOptions.map((item, index) => {
              return (
                <option key={`county-${index}`} value={item.code}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="street">详细地址</label>

        <textarea
          name="street"
          id="street"
          className="border rounded px-2 py-1"
          placeholder="街道、路名、小区名、楼号、单元号、门牌号等"
          rows={3}
          required
          autoComplete="street-address"
          disabled={!selectedProvince || !selectedCity || !selectedCounty}
        />
      </div>
    </fieldset>
  );
}

```

### B. API 服务模式

```bash
git clone https://github.com/kamaslau/chinese_regions.git
cd chinese_regions
cp .env.sample .env.local # 可在此配置服务端口
pnpm i
pnpm start
```

以通过 **3000** 端口（即 `.env.sample` 中既有的默认配置）进行服务为例，可相应路径如下：

- **GET /api** http://localhost:3000/api 全量数据，可用于数据导入等ETL场景
  - **GET /province** http://localhost:3000/api/province 全部省级行政区列表（含省、自治区、直辖市、特别行政区等）
    - **GET /:id/city** http://localhost:3000/api/province/370000/city 特定省级行政区（id 为该行政区代码）下辖的市级行政区列表
  - **GET /city** http://localhost:3000/api/city 全部市级行政区列表
    - **GET /:id/county** http://localhost:3000/api/city/370200/county 特定市级行政区（id 为该行政区代码）下辖的区县级行政区列表
  - **GET /county** http://localhost:3000/api/county 全部区县级行政区列表

## 数据结构

```txt
┌ "province" // 省级数据集
│├ "code": number, // 当前行政区划代码，下同
│└ "name": string // 当前行政区划名称，下同
├ "city" // 市级数据集
│├ "p_code": number, // 所属省级行政区划代码，下同
│├ "p_name": string, // 所属省级行政区划名称，下同
│├ "code": number,
│└ "name": string
└ "county" // 区县级数据集
 ├ "p_code": number,
 ├ "p_name": string,
 ├ "c_code": number, // 所属市级行政区划代码
 ├ "c_name": string, // 所属市级行政区划代码
 ├ "code": number,
 └ "name": string
```

### 数据样例

以山东省青岛市相关的部分数据为例：

```json
{
  "province": [
    {
      "code": 370000,
      "name": "山东省"
    }
  ],
  "city": [
    {
      "p_code": 370000,
      "p_name": "山东省",
      "code": 371300,
      "name": "临沂市"
    },
    {
      "p_code": 370000,
      "p_name": "山东省",
      "code": 370200,
      "name": "青岛市"
    },
    {
      "p_code": 370000,
      "p_name": "山东省",
      "code": 370700,
      "name": "潍坊市"
    }
  ],
  "county": [
    {
      "p_code": 370000,
      "p_name": "山东省",
      "c_code": 370200,
      "c_name": "青岛市",
      "code": 370211,
      "name": "黄岛区"
    },
    {
      "p_code": 370000,
      "p_name": "山东省",
      "c_code": 370200,
      "c_name": "青岛市",
      "code": 370283,
      "name": "平度市"
    },
    {
      "p_code": 370000,
      "p_name": "山东省",
      "c_code": 370200,
      "c_name": "青岛市",
      "code": 370215,
      "name": "即墨区"
    }
  ]
}
```

特殊情形：

- 对于北京、天津、上海、重庆等直辖市，以及香港、澳门等特别行政区，省、市信息是相同的；
- 对于澳门特别行政区,由于民政部未发布正式数据，而“澳门、氹仔、路环”的地理分区略显粗放，因而采用约定俗成的“堂区”这一教源分区。

此外，一些经济概念上的区域并非行政区划。例如，[成都市天府新区](https://cdstfxq.sczwfw.gov.cn/)作为四川省成都市的直管区（如华阳街道、万安街道、兴隆街道等），虽然经济和社会事务由四川省天府新区管理委员会（省级派出机构）直接进行管理，但在行政区划上仍属于成都市双流区。

## 关于港澳台地区

以下为民政部原始公示数据中未包含的行政区数据来源。

- 澳门特别行政区
  - [澳門特別行政區政府入口網站 – 澳門特別行政區政府入口網站](https://www.gov.mo/zh-hant/)
  - [中央政府驻澳门联络办公室](https://www.zlb.gov.cn/)
- 香港特别行政区
  - [GovHK 香港政府一站通：本港居民(主页)](https://www.gov.hk/sc/residents/)
  - [中央政府驻港联络办 - 中央人民政府驻香港特别行政区联络办公室](http://www.locpg.gov.cn/)
- 台湾省
  - [台湾基本情况\_中国政府网](https://www.gov.cn/guoqing/2020-07/28/content_5530577.htm)
  - [我的 E 政府](https://www.gov.tw/)
  - [中華民國 內政部戶政司 全球資訊網](https://www.ris.gov.tw/)
