/**
 * Created by berlin on 2017/3/6.
 * 爬取新闻列表页，抓取[新闻详情]并存到数据库
 */

const Crawler = require("crawler");
const url = require('url');
const request = require('request');
const admin = require("firebase-admin");
const serviceAccount = require("../security/fiery-heat-7406-firebase-adminsdk-kpbna-ed5b591529.json");
const config = require('../utils/config');

// import crawler config
const dachu_dishi = require('./config/dachu_dishi');
const crawlerConfigs = [
    dachu_dishi,
];

// constructor
let queueList = [],// 待爬取的[列表页]
    queueListResult = [],// 从 [新闻列表页] 中获取的列表结果
    queueDetailFiltered = [];// 排重后用于抓取的列表
const initQueue = () => {
    const _mergeAllConfigs = (configs) => {
        let mergedQueue = [];
        if (Array.isArray(configs) && configs.length) {
            configs.reduce((a, b) => a.concat(b)).forEach((item, index) => {
                mergedQueue.push({
                    uri: item.uri, callback: function (error, res, done) {
                        if (error) {
                            console.log(error);
                        } else {
                            let $ = res.$;
                            queueListResult = queueListResult.concat(item.listParser($, res));
                        }
                        done();
                    }
                });
            });
        }

        return mergedQueue;
    };
    queueList = _mergeAllConfigs(crawlerConfigs);
};
const resetQueueDetail = () => {
    queueListResult = [];
    queueDetailFiltered = [];
};
const detailCrawlerCbWrapper = (parser) =>function (error, res, done) {
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
        console.log('save news detail: ' + newsDetail.title);
    }
    done();
};
const initFirebase = () => {
    //firebase admin init
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://fiery-heat-7406.firebaseio.com/"
    });
    // Get a database reference to our blog
    let db = admin.database();
    let ref = db.ref("auto-news/");
};

// news list crawler
const listCrawler = new Crawler({
    maxConnections: 5,
});
// detail crawler
const detailCrawler = new Crawler({
    maxConnections: 5,
});

// Crawler event
listCrawler.on('drain', function () {
    queueListResult.forEach(item => {
        if (!item.isCrawled) {
            // not seen
            queueDetailFiltered.push({uri: item.url, callback: detailCrawlerCbWrapper(item.detailParser)});
        }
    });

    console.log('all list length: ', queueListResult.length, ' | detail queue length: ', queueDetailFiltered.length);
    if (queueDetailFiltered.length) {
        // have new details, crawl them
        detailCrawler.queue(queueDetailFiltered);
    } else {
        // no new details, crawl list again
        resetQueueDetail();
        setTimeout(() => listCrawler.queue(queueList), config.CRAWL_INTERVAL);
    }
});
detailCrawler.on('drain', function () {
    resetQueueDetail();
    console.log('wait to start crawl again...');
    setTimeout(() => listCrawler.queue(queueList), config.CRAWL_INTERVAL);
});

//init
// initFirebase();
initQueue();
listCrawler.queue(queueList);
