/**
 * Created by berlin on 2017/3/8.
 * Crawler Constructor
 */

const Crawler = require("crawler");
const request = require('request');
const config = require('../utils/config');
const db = require('./dbConnection');

module.exports = (option) => {
    // constructor
    let queueList = [],// 待爬取的[列表页]
        queueListResult = [],// 从 [新闻列表页] 中获取的列表结果
        queueDetailFiltered = [];// 排重后用于抓取的列表

    // 生成后并后的 list 抓取队列
    const generateQueueList = (configs) => {
        let mergedQueue = [];
        if (Array.isArray(configs) && configs.length) {
            configs.reduce((a, b) => a.concat(b)).forEach((item, index) => {
                mergedQueue.push({
                    uri: item.uri,
                    callback: listCrawlerCbWrapper(item),
                });
            });
        }

        return mergedQueue;
    };
    const listCrawlerCbWrapper = (item) => function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;

            let tempQueueResult = item.parser($, res);
            if (tempQueueResult.isAgain) {
                // crawl again for page
                listCrawler.queue(generateQueueList([tempQueueResult.queue]));
            } else {
                //save to database
                let newListRef = {};
                tempQueueResult.queue.forEach((item, index) => {
                    let newListItemRef = db.ref('list').push();
                    item._id = newListItemRef.key;//待detail push入库时，用作_id
                    newListItemRef = {
                        _id: item._id,//list document 唯一id
                        title: item.title,//文章标题
                        url: item.uri,//文章链接
                        date: item.date,//文章发布日期时间戳
                        origin: item.origin,//文章来源、出处
                        origin_id: item.origin_id,//指向 origin collection 中对应的 document id
                        originUrl: item.originUrl,//来源、出处链接
                    };
                    newListRef[item._id] = newListItemRef;

                    //通知web客户端
                    request({
                        method: 'POST',
                        url: 'http://localhost:' + config.HTTP_PORT + '/listItem_added',
                        headers: {'content-type': 'application/json'},
                        body: JSON.stringify(item),
                    }, function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {

                        } else {
                            console.log(error);
                        }
                    });
                });
                db.ref('list').set(newListRef);


                queueListResult = queueListResult.concat(tempQueueResult.queue);
            }
        }
        done();
    };
    const detailCrawlerCbWrapper = (parser, _id) => function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;
            let newsDetail = parser($, res);

            // save to database
            db.ref('detail').child(_id).set({
                    _id: _id,//文章唯一 document id
                    title: newsDetail.title,//文章标题
                    subTitle: newsDetail.subTitle,//文章副标题
                    category: newsDetail.category,//文章分类、子栏目、子版面、子频道
                    tags: newsDetail.tags,//文章标签、关键词
                    url: newsDetail.url,//文章地址
                    //content: newsDetail.content,//正文内容
                    authorName: newsDetail.authorName,//作者名
                    editorName: newsDetail.editorName,//编辑姓名
                    date: newsDetail.date,//文章发布日期时间戳
                    crawledDate: newsDetail.crawledDate,//抓取日期时间戳
                    origin: newsDetail.origin,//来源、出处名
                    origin_id: newsDetail.origin_id,//指向 origin collection 中对应的 document id
                }
            );

            console.log('save news detail: ' + JSON.stringify(newsDetail.title));
        }
        done();
    };
    const start = () => {
        console.log(` --- wait ${option.taskName} start in ${((option.taskInterval || config.CRAWL_INTERVAL) / 60000).toFixed(1)}min ---`);
        queueList = generateQueueList([
            typeof option.queue == 'function' ? option.queue() : option.queue,
        ]);

        queueListResult = [];
        queueDetailFiltered = [];

        setTimeout(() => listCrawler.queue(queueList), option.taskInterval || config.CRAWL_INTERVAL);
    };

// news list crawler
    const listCrawler = new Crawler({
        rateLimit: option.rateLimit || 0,
        maxConnections: option.maxConnections || 5,
    });
// detail crawler
    const detailCrawler = new Crawler({
        rateLimit: option.rateLimit || 0,
        maxConnections: option.maxConnections || 5,
    });

// Crawler event
    listCrawler.on('drain', function () {
        queueListResult.forEach(item => {
            if (!item.isCrawled) {
                // not seen
                queueDetailFiltered.push({
                    uri: item.uri,
                    callback: detailCrawlerCbWrapper(item.detailParser, item._id),
                });
            }
        });

        console.log(`start crawl ${option.taskName} detail: ${queueDetailFiltered.length}/${queueListResult.length}`);
        if (queueDetailFiltered.length) {
            // have new details, crawl them
            detailCrawler.queue(queueDetailFiltered);
        } else {
            // no new details, crawl list again
            start();
        }
    });
    detailCrawler.on('drain', function () {
        start();
    });

    return start;
};
