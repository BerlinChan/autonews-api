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

// news list crawler
let detailQueue = [];
const queueList = [
    'http://hb.qq.com/l/yc/list20130619124315.htm',// 大楚-宜昌-新闻列表
    //'http://hb.qq.com/l/xy/list20130619124740.htm',// 大楚-襄阳-新闻列表
];
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
                detailQueue.push({
                    title: $(this).children('a').text(),
                    url: $(this).children('a').attr('href'),
                    date: $(this).children('span').text(),
                    duplicate: seen.exists($(this).children('a').attr('href')),
                });
            });
        }
        done();
    }
});
listCrawler.queue(queueList);

// detail crawler
const detailCrawler = new Crawler({
    maxConnections: 5,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;

            let newsListDom = $(".mod.newslist li");
            newsListDom.each(function (index) {
                detailQueue.push({
                    title: $(this).children('a').text(),
                    url: $(this).children('a').attr('href'),
                    date: $(this).children('span').text(),
                    duplicate: seen.exists($(this).children('a').attr('href')),
                });
            });
        }
        done();
    }
});
detailCrawler.queue(detailQueue.map(item => {
    if (!item.duplicate) {
        return item.url;
    }
}));


