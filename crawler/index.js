/**
 * Created by berlin on 2017/3/6.
 * 爬取大楚地市新闻列表页面，抓取[新闻详情]并存到数据库
 */

const Crawler = require("crawler");
const url = require('url');
const request = require('request');
const admin = require("firebase-admin");
const serviceAccount = require("../security/fiery-heat-7406-firebase-adminsdk-kpbna-ed5b591529.json");
const config = require('../utils/config');

const dachu_dishi = require('./config/dachu_dishi');
const crawlerConfigs = [dachu_dishi];

// constructor
let queueuList = [],// 待爬取的[列表页]
    queueDetail = [],// 从 [新闻列表页] 中获取的列表
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
                            queueDetail = queueDetail.concat(item.processor($, res));
                        }
                        done();
                    }
                });
            });
        }

        return mergedQueue;
    };
    queueuList = _mergeAllConfigs(crawlerConfigs);
};
const resetQueueDetail = () => {
    queueDetail = [];
    queueDetailFiltered = [];
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
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;

            let mainDom = $(".main");
            let newsDetail = {
                title: mainDom.find('.hd h1').text(),
                origin: mainDom.find('.hd .tit-bar .color-a-1').text(),
                originUrl: res.request.uri.href,
                //content: mainDom.find('.bd #Cnt-Main-Article-QQ').html(),
                authorName: mainDom.find('.hd .tit-bar .color-a-3').text(),
                editorName: mainDom.find('.ft .QQeditor').text(),
                date: mainDom.find('.hd .tit-bar .article-time').text(),
            };

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
    }
});

// Crawler event
listCrawler.on('drain', function () {
    queueDetail.forEach(item => {
        if (!item.isCrawled) {
            queueDetailFiltered.push(item.url);
        }
    });

    console.log('all list length: ', queueDetail.length, ' | detail queue length: ', queueDetailFiltered.length);
    if (queueDetailFiltered.length) {
        // have new details, crawl them
        detailCrawler.queue(queueDetailFiltered);
    } else {
        // no new details, crawl list again
        resetQueueDetail();
        setTimeout(() => listCrawler.queue(queueuList), config.CRAWL_INTERVAL);
    }
});
detailCrawler.on('drain', function () {
    resetQueueDetail();
    console.log('wait to crawl list again...');
    setTimeout(() => listCrawler.queue(queueuList), config.CRAWL_INTERVAL);
});

//init
// initFirebase();
initQueue();
listCrawler.queue(queueuList);
