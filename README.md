# Auto News 

新闻源监控系统(Auto News System)，是一个实时监控、收录新闻更新的工具，主要功能如下：

- 准实时监控新闻更新并汇总反应到界面，免除人工值守，反复刷新监控
- 汇总分散的新闻，提供一处界面总览当日新闻全局，供网络新闻编辑和新闻关注者查阅、筛选、处理
- 查询往期内容，为新闻专题、汇总专题、旧闻查阅提供数据参考
- (开发中的功能……)

目前监控对象如下：
- 腾讯·大楚网新闻，包括: 要闻/宜昌/襄阳/黄石/十堰/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
- 三峡晚报
- 楚天都市报
- 湖北日报
- 楚天金报
- 楚天快报
- 楚天时报
- 长江日报
- 武汉晚报
- 武汉晨报
- 黄石日报（待添加）添加中……

## 运行
- run mongoDB server: `mongod --config /usr/local/etc/mongod.conf`
- init db: `node src/crawler/dbInit.js`
- 运行HTTP服务：`node server/index.js`
- 运行爬虫：`node src/crawler/index.js`
- 编译客户端：`npm run deploy:prod`
- 打开客户端： [localhost:3090/autonews/](http://localhost:3090/autonews/)
- 客户端 dev 环境：运行`npm start`，打开 [localhost:3091/autonews/](http://localhost:3091/autonews/)

## 目录说明
    root
    |--public               http root
    |--server               HTTP API 服务
    |--src                  源代码
        |--client           Web客户端源码
        |--crawler          爬虫
        |--utils            全局配置
    
## 数据结构
设计中，以`大楚网`爬虫为蓝本来设计，然后将结构说明记录至此
### origin - 新闻源出处

### list - 新闻列表

### detail - 新闻详情

## 常用命令
- 备份mongodb：`mongodump -h 127.0.0.1:27017 -d auto-news -o C:\data\backup\`
- 恢复mongodb：`mongorestore -h 127.0.0.1:27017 -d auto-news C:\data\backup\auto-news`
