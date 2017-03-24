/**
 * Created by berlin on 2017/3/8.
 * Crawler Creator
 */

const Crawler = require("crawler");
const config = require('../utils/config');
const monk = require('monk');
const {insertListItem, insertDetailItem, isDuplicate} = require('./dbConnection');
const request = require('request');// for send a request to HTTP server, push list item to client

function CrawlerCreator(option) {
    // init
    let queueList = [],// 待爬取的[列表页]
        queueDetail = [];// 排重后用于抓取的列表

    // crawler instance
    const listCrawler = new Crawler({
        rateLimit: option.rateLimit || 0,
        maxConnections: option.maxConnections || 5,
    });
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
        return async function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                let $ = res.$;

                let tempQueueResult = item.parser($, res);
                if (tempQueueResult.isAgain) {
                    // crawl again for page
                    listCrawler.queue(_generateQueueList([tempQueueResult.queue]));
                } else if (tempQueueResult.queue.length) {
                    // remove duplicate & generate detail queue
                    await isDuplicate(tempQueueResult.queue.map(item => item.uri))
                        .then(isDuplicateResult => {
                            isDuplicateResult.forEach((isDuplicate, index) => {
                                if (!isDuplicate) {
                                    tempQueueResult.queue[index]._id = monk.id();//list item, 待 detail item 同时入库时
                                    queueDetail.push({
                                        uri: tempQueueResult.queue[index].uri,
                                        callback: _detailCrawlerCbWrapper(tempQueueResult.queue[index].detailParser, tempQueueResult.queue[index]),
                                    });
                                }
                            });
                        });
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
                }, async function callback(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        //insert to db
                        await insertListItem(listItem)
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
        console.log(`--- crawler ${option.taskName} start ---`);
        queueList = _generateQueueList([
            typeof option.queue === 'function' ? option.queue() : option.queue,
        ]);
        queueDetail = [];
        listCrawler.queue(queueList);
    }

    // Crawler event
    listCrawler.on('drain', function () {
        if (queueDetail.length) {
            console.log(`start crawl ${option.taskName}, queue: ${queueDetail.length}`);
            // have new details, crawl them
            detailCrawler.queue(queueDetail);
        } else {
            console.log(`--- ${option.taskName} has no new item, wait ${((option.taskInterval || config.CRAWL_INTERVAL) / 60000).toFixed(1)}min and try again ---`);
            setTimeout(() => start(), option.taskInterval || config.CRAWL_INTERVAL);
        }
    });
    detailCrawler.on('drain', function () {
        console.log(`--- ${option.taskName} complete, wait ${((option.taskInterval || config.CRAWL_INTERVAL) / 60000).toFixed(1)}min and start again ---`);
        setTimeout(() => start(), option.taskInterval || config.CRAWL_INTERVAL);
    });

    return start;
}

module.exports = CrawlerCreator;
