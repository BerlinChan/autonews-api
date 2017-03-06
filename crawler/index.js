/**
 * Created by berlin on 2017/3/6.
 * 爬取大楚地市新闻列表页面，抓取[新闻详情]并存到数据库
 */

const Crawler = require("crawler");
const url = require('url');
const Seenreq = require('seenreq');//remove duplicate news
const seen = new Seenreq();
const admin = require("firebase-admin");
const serviceAccount = require("../security/fiery-heat-7406-firebase-adminsdk-kpbna-ed5b591529.json");

const initFirebase = ()=> {
    //firebase admin init
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://fiery-heat-7406.firebaseio.com/"
    });
    // Get a database reference to our blog
    let db = admin.database();
    let ref = db.ref("auto-news/");
};

const QUEUE_LIST = [
    'http://hb.qq.com/l/yc/list20130619124315.htm',// 大楚-宜昌-新闻列表
    //'http://hb.qq.com/l/xy/list20130619124740.htm',// 大楚-襄阳-新闻列表
];//新闻目录页面地址
const INTERVAL = 10 * 1000;//开始新一轮抓取间隔时间，单位：ms

let queueDetail = [];
let queueDetailFiltered = [];

// news list crawler
const listCrawler = new Crawler({
    maxConnections: 5,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;

            let newsListDom = $(".mod.newslist li");
            newsListDom.each(function (index) {
                queueDetail.push({
                    title: $(this).children('a').text(),
                    url: $(this).children('a').attr('href'),
                    date: $(this).children('span').text(),
                    origin: $('title').text(),
                    originUrl: res.request.uri.href,
                    duplicate: seen.exists($(this).children('a').attr('href')),
                });
            });
        }

        done();
    }
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
                content: mainDom.find('.bd #Cnt-Main-Article-QQ').html(),
                autherName: mainDom.find('.hd .tit-bar .color-a-3').text(),
                editorName: mainDom.find('.ft .QQeditor').text(),
            };

            // save to database
            // ref.child('detail').push(newsDetail);
            console.log('save news detail: ' + newsDetail.title);
        }

        done();
    }
});

// Crawler event
listCrawler.on('drain', function () {
    queueDetail.forEach(item => {
        if (!item.duplicate) {
            queueDetailFiltered.push(item.url);
        }
    });

    console.log('all list length: ', queueDetail.length, ' | detail queue length: ', queueDetailFiltered.length);
    if (queueDetailFiltered.length) {
        // have new details, crawl them
        detailCrawler.queue(queueDetailFiltered);
    } else {
        // no new details, crawl list again
        queueDetail = [];
        queueDetailFiltered = [];
        setTimeout(() => listCrawler.queue(QUEUE_LIST), INTERVAL);
    }
});
detailCrawler.on('drain', function () {
    queueDetail = [];
    queueDetailFiltered = [];
    console.log('wait to crawl list again...');
    setTimeout(() => listCrawler.queue(QUEUE_LIST), INTERVAL);
});

//init
// initFirebase();
listCrawler.queue(QUEUE_LIST);
