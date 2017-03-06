/**
 * Created by berlin on 2017/3/6.
 * 测试爬取大楚宜昌新闻列表页面，得到[新闻列表]
 */

const Crawler = require("crawler");
const url = require('url');
const Seenreq = require('seenreq');//remove duplicate news
const seen = new Seenreq();
const admin = require("firebase-admin");
const serviceAccount = require("../security/fiery-heat-7406-firebase-adminsdk-kpbna-ed5b591529.json");

//firebase admin init
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fiery-heat-7406.firebaseio.com/"
});
// Get a database reference to our blog
let db = admin.database();
let ref = db.ref("auto-news/");

const queueList = [
    'http://hb.qq.com/l/yc/list20130619124315.htm',// 大楚-宜昌-新闻列表
    //'http://hb.qq.com/l/xy/list20130619124740.htm',// 大楚-襄阳-新闻列表
];
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
            ref.child('detail').push(newsDetail);
            console.log('save news detail: ' + newsDetail.title);
        }

        done();
    }
});

listCrawler.on('drain', function () {
    queueDetailFiltered = queueDetail.map(item => {
        if (!item.duplicate) {
            return item.url;
        }
    });

    console.log('111111', queueDetail.length, queueDetailFiltered.length);
    detailCrawler.queue(queueDetailFiltered);
});
detailCrawler.on('drain', function () {
    queueDetail = [];
    queueDetailFiltered = [];
    console.log('crawl news list start');
    setTimeout(() => listCrawler.queue(queueList), 10000);
});

//init
listCrawler.queue(queueList);
