/**
 * Created by berli on 2017/3/21.
 */
const Crawler = require("crawler");
const url = require('url');

const c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            let mainDom = $(".main");
            let contentImg = '', contentText = '';
            mainDom.find('.bd #Cnt-Main-Article-QQ img').each(function (index) {
                if ($(this).attr('src')) {
                    contentImg += $(this).clone().wrap('<div/>').parent().html();
                }
            });
            mainDom.find('.bd #Cnt-Main-Article-QQ p').each(function (index) {
                contentText += '<p>' + $(this).text() + '</p>';
            });

            console.log(contentText);
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue('http://hb.qq.com/a/20170401/033071.htm');
