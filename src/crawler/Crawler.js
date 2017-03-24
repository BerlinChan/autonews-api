/**
 * Created by berlin on 2017/3/8.
 * Crawler Creator
 */

const Crawler = require("crawler");
const config = require('../utils/config');
const monk = require('monk');
const {db, insertListItem, insertDetailItem, isDuplicate} = require('./dbConnection');
const request = require('request');// for send a request to HTTP server, push list item to client

function CrawlerCreator(option) {
    // init
    let shouldListRun = true,
        queueList = [],// 待爬取的[列表页]
        queueDetail = [];// 排重后用于抓取的列表

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

    // 生成 option 中合并后的 list 队列
    function _generateQueueList(configs) {
        let mergedQueue = [];
        if (Array.isArray(configs) && configs.length) {
            configs.reduce((a, b) => a.concat(b)).forEach((item, index) => {
                mergedQueue.push({
                    uri: item.uri,
                    callback: _listCrawlerCbWrapper(item),
                });
            });
        }

        return mergedQueue;
    }

    function _listCrawlerCbWrapper(item) {
        return function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                let $ = res.$;

                try {
                    item.parser($, res).then(tempQueueResult => {
                        if (tempQueueResult.isAgain) {
                            // crawl again for page
                            listCrawler.queue(_generateQueueList([tempQueueResult.queue]));
                        } else if (tempQueueResult.queue.length) {
                            // remove duplicate & generate detail queue
                            shouldListRun = false;
                            tempQueueResult.queue.forEach(item => {
                                item._id = monk.id();//list item, 待 detail item 同时入库时
                                queueDetail.push({
                                    uri: item.uri,
                                    callback: _detailCrawlerCbWrapper(item.detailParser, item),
                                });
                            });
                        }
                    });
                }
                catch (error) {
                    console.log('Get list error: ', error);
                }
            }
            done();
        };
    }

    function _detailCrawlerCbWrapper(parser, listItem) {
        return function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                let $ = res.$;
                let newsDetailItem = parser($, res);

                //通知web客户端
                request({
                    method: 'POST',
                    url: 'http://localhost:' + config.HTTP_PORT + '/listItem_added',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify({
                        title: listItem.title,
                        url: listItem.uri,
                        date: listItem.date,
                        origin_key: listItem.origin_key,
                        key: listItem._id,
                    }),
                }, function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        //insert to db
                        insertListItem(listItem)
                            .then(() => {
                                return insertDetailItem(listItem._id, newsDetailItem)
                            });
                    } else {
                        console.log(error);
                    }
                });
            }
            done();
        };
    }

    function start() {
        console.log(` --- crawler ${option.taskName} start ---`);
        queueList = _generateQueueList([
            typeof option.queue == 'function' ? option.queue() : option.queue,
        ]);
        shouldListRun = true;
        queueDetail = [];
        listCrawler.queue(queueList);
    }

    // Crawler event
    listCrawler.on('drain', function () {
        if (!shouldListRun && queueDetail.length) {
            console.log(`start crawl ${option.taskName}, queue: ${queueDetail.length}`);
            // have new details, crawl them
            detailCrawler.queue(queueDetail);
        }
    });
    detailCrawler.on('drain', function () {
        console.log(` --- wait ${option.taskName} start in ${((option.taskInterval || config.CRAWL_INTERVAL) / 60000).toFixed(1)}min ---`);
        setTimeout(() => start(), option.taskInterval || config.CRAWL_INTERVAL);
    });

    return start;
}

module.exports = CrawlerCreator;
