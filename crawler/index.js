/**
 * Created by berlin on 2017/3/6.
 * 测试爬取大楚宜昌新闻列表页面，得到[新闻列表]
 */

const Crawler = require("crawler");
const url = require('url');
const seenreq = require('seenreq');//remove duplicate news
const seen = new seenreq();
const admin = require("firebase-admin");
const serviceAccount = require("../security/fiery-heat-7406-firebase-adminsdk-kpbna-ed5b591529.json");

//firebase init
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fiery-heat-7406.firebaseio.com/"
});

const c = new Crawler({
    maxConnections: 10,
    skipDuplicates: true,//use [seenreq] instead
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server

            var newsList = [{title: '', url: ''}];
            var newsListDom = $(".mod.newslist li");
            newsListDom.each(function (index) {
                newsList.push({
                    title: $(this).children('a').text(),
                    url: $(this).children('a').attr('href'),
                    date: $(this).children('span').text(),
                });
            });
            console.log(newsList);
        }
        done();
    }
});

//remove requests are sent
var queueList = [
    'http://hb.qq.com/l/yc/list20130619124315.htm',// 大楚-宜昌-新闻列表
    //'http://hb.qq.com/l/xy/list20130619124740.htm',// 大楚-襄阳-新闻列表
];
//console.log(seen.exists(url));//false

// Queue a list of URLs
c.queue(queueList);
