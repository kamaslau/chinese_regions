# chinese_regions

![npm](https://img.shields.io/npm/v/chinese_regions)

中国省、市、区/县级行政区划代码及名称。港澳台地区等均已包含。

数据根据中华人民共和国民政部官方发布的数据更新，一般为调整某地（或数地）行政区后进行相应更新，例如撤并、县改区、市直辖等情况。对于具体行政区划变更情况，可参见[更新日志](./CHANGE_LOG.md)

## 安装

```JavaScript
npm i chinese_regions

import Regions from 'chinese_regions'
```

## 数据结构

```json
{
  // 省级
  "province": [
    {
      "code": 370000, // 当前行政区划代码
      "name": "山东省" // 当前行政区划名称
    }
  ],
  // 市级
  "city": [
    {
      "p_code": 370000, // 所属省级行政区划代码
      "p_name": "山东省", // 所属省级行政区划名称
      "code": 370200,
      "name": "青岛市"
    }
  ],
  // 区县级
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
      "code": 370200,
      "name": "青岛市"
    },
    {
      "p_code": 370000,
      "p_name": "山东省",
      "code": 370100,
      "name": "济南市"
    },
    {
      "p_code": 370000,
      "p_name": "山东省",
      "code": 370600,
      "name": "烟台市"
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
      "code": 370202,
      "name": "市南区"
    },
    {
      "p_code": 370000,
      "p_name": "山东省",
      "c_code": 370200,
      "c_name": "青岛市",
      "code": 370203,
      "name": "市北区"
    },
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
      "code": 370212,
      "name": "崂山区"
    },
    {
      "p_code": 370000,
      "p_name": "山东省",
      "c_code": 370200,
      "c_name": "青岛市",
      "code": 370213,
      "name": "李沧区"
    },
    {
      "p_code": 370000,
      "p_name": "山东省",
      "c_code": 370200,
      "c_name": "青岛市",
      "code": 370214,
      "name": "城阳区"
    }
  ]
}
```

特别的，北京、天津、上海、重庆等直辖市的相关数据中，省、市信息是相同的；港澳台地区的相关数据中，由于民政部未发布正式数据，省、市、区/县信息暂时也是相同的。

## 应用场景

### 前端

适用于级联选择器等组件

1. 输出并选择 province 键下的省级行政区
2. 根据 province 值输出 city 键下的市级行政区
3. 根据 city 值输出 county 键下的区/县级行政区

### 后端

适用于查询构建器等业务

1. 引入 all.min.json 文件并解析为所需类型
2. 保存数据到数据库的相关表，例如 region 等
