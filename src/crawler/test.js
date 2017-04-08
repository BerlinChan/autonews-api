/**
 * Created by berli on 2017/3/21.
 */
const Crawler = require("crawler");
const url = require('url');
const request = require('request-promise');

const c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: async function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            let mainDom = $(".main");
            let contentImg = '', contentText = '', result = '';
            mainDom.find('.bd #Cnt-Main-Article-QQ img').each(function (index) {
                if ($(this).attr('src')) {
                    contentImg += $(this).clone().wrap('<div/>').parent().html();
                }
            });
            mainDom.find('.bd #Cnt-Main-Article-QQ #contTxt').each(function (index) {
                contentText += '<p>' + $(this).text() + '</p>';
            });


            // if active page
            if (contentText)
                await request(res.request.uri.href.split('htm')[0] + 'hdPic.js')
                    .then(resp => eval('contentText=' + resp));

            console.log(contentText.Children[0].Children);
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue('http://hb.qq.com/a/20170403/022565.htm');
