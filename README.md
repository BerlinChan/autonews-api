# Auto News

用于新闻抓取并实时推送到Web客户端，目前主要收集湖北省内报纸与大型门户网站新闻。

## 运行
运行爬虫：`node crawler/index.js`

运行HTTP服务：`node server/index.js`

## 目录说明
    root
    |--client           Web客户端
    |--crawler          爬虫
    |--security         证书／密钥
    |--server           HTTP服务
    |--utils            全局配置／库文件
    
## 数据结构
设计中，以`大楚网`爬虫为蓝本来设计，然后将结构说明记录至此
### origin - 新闻源出处

### list - 新闻列表

### detail - 新闻详情