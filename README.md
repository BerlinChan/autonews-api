# Auto News

用于新闻抓取并实时推送到Web客户端，目前主要收集湖北省内报纸与大型门户网站新闻。

## 运行
- run mongoDB server: `mongod --config /usr/local/etc/mongod.conf`
- init db: `node src/crawler/dbInit.js`
- 运行HTTP服务：`node server/index.js`
- 运行爬虫：`node src/crawler/index.js`
- 编译客户端：`npm run deploy:prod`
- 打开客户端： [localhost:3090](http://localhost:3090)

## 目录说明
    root
    |--functions            firebase functions
    |--public               http root
    |--server               HTTP服务
    |--src                  源代码
        |--client           Web客户端
        |--crawler          爬虫
        |--utils            全局配置／库文件/证书／密钥
    
## 数据结构
设计中，以`大楚网`爬虫为蓝本来设计，然后将结构说明记录至此
### origin - 新闻源出处

### list - 新闻列表

### detail - 新闻详情

## 常用命令
- 备份mongodb：`mongodump -h 127.0.0.1:27017 -d auto-news -o C:\data\backup\`
- 恢复mongodb：`mongorestore -h 127.0.0.1:27017 -d auto-news C:\data\backup\auto-news`
