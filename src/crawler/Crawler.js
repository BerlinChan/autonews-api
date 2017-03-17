/**
 * Created by berlin on 2017/3/8.
 * Crawler Constructor
 */

const Crawler = require("crawler");
const config = require('../utils/config');
const monk = require('monk');
const {db, insertList, insertDetail} = require('./dbConnection');

module.exports = (option) => {
    // constructor
    let queueList = [],// 待爬取的[列表页]
        queueDetail = [];// 排重后用于抓取的列表

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

            item.parser($, res).then(tempQueueResult => {
                if (tempQueueResult.isAgain) {
                    // crawl again for page
                    listCrawler.queue(generateQueueList([tempQueueResult.queue]));
                } else if (tempQueueResult.queue.length) {
                    // remove duplicate & generate detail queue
                    tempQueueResult.queue.forEach(item => {
                        item.id = monk.id();//生成 id, 待 detail 入库时与之 _id 对应
                        queueDetail.push({
                            uri: item.uri,
                            callback: detailCrawlerCbWrapper(item.detailParser, item.id),
                        });
                    });

                    //insert to db
                    insertList(tempQueueResult.queue);
                }
            });
        }
        done();
    };
    const detailCrawlerCbWrapper = (parser, id) => function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;
            let newsDetail = parser($, res);

            //insert to db
            insertDetail(id, newsDetail);
        }
        done();
    };
    const start = () => {
        console.log(` --- wait ${option.taskName} start in ${((option.taskInterval || config.CRAWL_INTERVAL) / 60000).toFixed(1)}min ---`);
        queueList = generateQueueList([
            typeof option.queue == 'function' ? option.queue() : option.queue,
        ]);

        queueDetail = [];

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
        console.log(`start crawl ${option.taskName}, queue: ${queueDetail.length}`);
        if (queueDetail.length) {
            // have new details, crawl them
            detailCrawler.queue(queueDetail);
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
