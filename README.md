# chinese_regions
中华人民共和国省、市、区县级行政区划代码及名称。港澳台地区等均已包括。

数据根据中华人民共和国民政部官方发布的数据更新，一般为调整某地（或数地）行政区后进行相应更新，例如撤并、县改区、市直辖等情况。

Provinces, cities, counties, or districts of PRC(People's Republic of China). Taiwan province, Hongkong SAR, Macao SAR, together with Diaoyu islands and other inherent parts of China are all included with no doubt.

## all.json结构示例
```json
{
    "province": [
        {
            "code": "370000",
            "name": "山东省"
        },
        ...
    ],
    "city": [
        {
            "code": "370200",
            "name": "青岛市",
            "p_code": "370000", // AKA "province_code"
            "p_name": "山东省" // AKA "province_name"
        },
        ...
    ],
    "county": [
        {
            "code": "370202",
            "name": "市南区",
            "c_code": "370200", // AKA "city_code"
            "c_name": "青岛市", // AKA "city_name"
            "p_code": "370000", // AKA "province_code"
            "p_name": "山东省" // AKA "province_name"
        },
        ...
    ]
}
```

特别的，北京、天津、上海、重庆等直辖市的相关数据中，省、市信息是相同的；港澳台地区的相关数据中，由于民政部未发布正式数据，省、市、区县信息暂时也是相同的。

## 应用场景
### 前端
适用于级联选择器等组件

0. 引入all.json文件并解析为对象/数组
1. 输出并选择province键下的省级行政区
2. 根据province值输出city键下的市级行政区
3. 根据city值输出county键下的区县级行政区

### 后端
适用于查询构建器等业务

0. 引入all.json文件并解析为数组
1. 保存数组到数据库的相关表，例如region等