/**
 * Created by berlin on 2017/3/6.
 * 爬取新闻列表页，抓取[新闻详情]并存到数据库
 */

const Crawler = require("crawler");
const request = require('request');
const admin = require("firebase-admin");
const serviceAccount = require("../security/fiery-heat-7406-firebase-adminsdk-kpbna-ed5b591529.json");
const config = require('../utils/config');

// import crawler config
const dachu_dishi = require('./config/dachu_dishi');
const sxwb = require('./config/sxwb');


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
const listCrawlerCbWrapper = (item) =>function (error, res, done) {
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
        console.log('save news detail: ' + JSON.stringify(newsDetail.title));
    }
    done();
};
const initCrawler = () => {
    console.log(' --- init and wait ', (config.CRAWL_INTERVAL / 60000).toFixed(1), 'min to restart ---');
    queueList = generateQueueList([
        //dachu_dishi,
        sxwb.getRecentDateList(new Date()),
    ]);
    queueListResult = [];
    queueDetailFiltered = [];
    setTimeout(() => listCrawler.queue(queueList), config.CRAWL_INTERVAL);
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
    rateLimit: 2000,
    maxConnections: 1,
});
// detail crawler
const detailCrawler = new Crawler({
    rateLimit: 2000,
    maxConnections: 1,
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

    console.log('all list length: ', queueListResult.length, ' | detail queue length: ', queueDetailFiltered.length);
    if (queueDetailFiltered.length) {
        // have new details, crawl them
        detailCrawler.queue(queueDetailFiltered);
    } else {
        // no new details, crawl list again
        initCrawler();
    }
});
detailCrawler.on('drain', function () {
    initCrawler();
});

//init
// initFirebase();
module.exports = initCrawler;
