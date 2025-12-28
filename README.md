# chinese_regions

![npm](https://img.shields.io/npm/v/chinese_regions)
![NPM Downloads](https://img.shields.io/npm/dy/chinese_regions)

中华人民共和国民政部区划地名司官方公布的行政区划信息数据，含省/直辖市/特别行政区、市、区/县级行政区划代码及名称。

香港、澳门、台湾等数据均具体到区/县级别。

当前数据最后更新于 2025 年 12 月 16 日，根据[中华人民共和国民政部于 2025 年 04 月 25 日最新发布的数据](https://www.mca.gov.cn/mzsj/xzqh/2025/202401xzqh.html)生成，一般为调整某地（或数地）行政区后进行相应更新，例如撤并、县改区、市直辖等情况。对于具体行政区划变更情况，可参见[更新日志](./CHANGE_LOG.md)

## 港澳台地区

### 澳门特别行政区

数据来源

- [澳門特別行政區政府入口網站 – 澳門特別行政區政府入口網站](https://www.gov.mo/zh-hant/)
- [中央政府驻澳门联络办公室](https://www.zlb.gov.cn/)

### 香港特别行政区

数据来源

- [GovHK 香港政府一站通：本港居民(主页)](https://www.gov.hk/sc/residents/)
- [中央政府驻港联络办 - 中央人民政府驻香港特别行政区联络办公室](http://www.locpg.gov.cn/)

### 台湾省

数据来源

- [台湾基本情况\_中国政府网](https://www.gov.cn/guoqing/2020-07/28/content_5530577.htm)
- [我的 E 政府](https://www.gov.tw/)
- [中華民國 內政部戶政司 全球資訊網](https://www.ris.gov.tw/)

## 安装

以 PNPM 作为包管理器为例：

### 数据包模式

```javascript
// pnpm
pnpm add chinese_regions

import Regions from "chinese_regions" with { type: "json" };
console.log(
  `${Regions.province?.length ?? 0} provinces, `,
  `${Regions.city?.length ?? 0} cities, `,
  `${Regions.county?.length ?? 0} counties, `,
  "loaded from package chinese_regions"
)
```

### API 服务模式

```bash
git clone https://github.com/kamaslau/chinese_regions.git
cd chinese_regions
pnpm i
pnpm start
```

## 数据结构

```json
{
  // 省级数据集
  "province": [
    {
      "code": 370000, // 当前行政区划代码
      "name": "山东省" // 当前行政区划名称
    }
  ],
  // 市级数据集
  "city": [
    {
      "p_code": 370000, // 所属省级行政区划代码
      "p_name": "山东省", // 所属省级行政区划名称
      "code": 370200,
      "name": "青岛市"
    }
  ],
  // 区县级数据集
  "county": [
    {
      "p_code": 370000,
      "p_name": "山东省",
      "c_code": 370200, // 所属市级行政区划代码
      "c_name": "青岛市", // 所属市级行政区划代码
      "code": 370202,
      "name": "市南区"
    }
  ]
}
```

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
- 对于澳门特别行政区：由于民政部未发布正式数据，而“澳门、氹仔、路环”的地理分区略显粗放，因而采用约定俗成的“堂区”这一教源分区。

此外，一些经济概念上的区域并非行政区划。例如，天府新区作为成都直辖市的直管区（如华阳街道、万安街道、兴隆街道等），虽然经济和社会事务由四川天府新区管理委员会（省级派出机构）直接进行管理，但在法理和行政区划上仍属于成都市双流区。

## 应用场景

为提高开发效率，推荐将此库部署到自建 NPM 注册源。

### 前端开发

适用于级联选择器等组件，推荐部署到 CDN。

1. 输出并选择 province 键下的省级行政区
2. 根据 province 值输出 city 键下的市级行政区
3. 根据 city 值输出 county 键下的区/县级行政区

### 后端开发

适用于查询构建器等业务

1. 保存数据到缓存层、持久层，或部署到组件库进行调用
