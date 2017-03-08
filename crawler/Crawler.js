/**
 * Created by berlin on 2017/3/8.
 * Crawler Constructor
 */

const Crawler = require("crawler");
const request = require('request');
const config = require('../utils/config');

module.exports = (option) => {
    // constructor
    let queueList = [],// 待爬取的[列表页]
        queueListResult = [],// 从 [新闻列表页] 中获取的列表结果
        queueDetailFiltered = [];// 排重后用于抓取的列表
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
                queueListResult = queueListResult.concat(tempQueueResult);
            }
        }
        done();
    };
    const detailCrawlerCbWrapper = (parser) => function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;
            let newsDetail = parser($, res);

            // save to database
            // ref.child('detail').push(newsDetail);
            request({
                method: 'POST',
                url: 'http://localhost:' + config.HTTP_PORT + '/addNews',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(newsDetail),
            }, function callback(error, response, body) {
                if (!error && response.statusCode == 200) {

                } else {
                    console.log(error);
                }
            });
            console.log('save news detail: ' + JSON.stringify(newsDetail.title));
        }
        done();
    };
    const start = () => {
        console.log(' --- init and wait ' + option.taskName + ' ' + ((option.taskInterval || config.CRAWL_INTERVAL) / 60000).toFixed(1), 'min to restart ---');
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
                    callback: detailCrawlerCbWrapper(item.detailParser),
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
