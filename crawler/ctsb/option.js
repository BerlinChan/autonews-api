/**
 * Created by berlin on 2017/3/8.
 * 楚天时报
 * http://epaper.cnhubei.com/cache/paper_ctsb.aspx
 */

const S = require('string');
const moment = require('moment');
const Seenreq = require('seenreq');// for remove duplicate news
const seen = new Seenreq();

// page 解析处理器
const parser_page = ($, res) => {
    let queuePage = [];//版面队列
    let title = $('title').text();
    if (title == '楚天时报—楚天时报电子版') {
        $('tr td.info3').each(function (index) {
            let onclickAttr = $(this).attr('onclick');
            if (onclickAttr) {
                queuePage.push({
                    uri: res.request.uri.href + S(onclickAttr).between('(\'', '\',').s,
                    pageTitle: $(this).children('a').text(),
                    origin: title,
                    parser: parser_list,
                });
            }
        });
    }

    return {
        isAgain: true,// page 处理完再处理 list
        queue: queuePage,
    };
};
// list parser
const parser_list = ($, res) => {
    let newsListDom = $("td[width=300] tr td");
    let tempQueueDetail = [];
    newsListDom.each(function (index) {
        let onclickAttr = $(this).attr('onclick');
        if (onclickAttr) {
            let date = S(onclickAttr).between('ctsb/', '/ctsb').s;
            let url = 'http://epaper.cnhubei.com/HTML/ctsb/'
                + date + '/'
                + S(onclickAttr).between(date + '/', '\',\'').s;
            tempQueueDetail.push({
                title: $(this).children('a').text(),//文章标题
                uri: url,//文章链接
                date: res.headers['last-modified'],//文章发布日期
                crawledDate: new Date(),//抓取日期
                origin: $('title').text(),//文章来源
                originUrl: res.request.uri.href,//来源链接
                isCrawled: seen.exists(url),//是否已采集
                detailParser: detailParser,//对应[详情页]解析函数
            });
        }
    });

    return tempQueueDetail;
};
// detail parser
const detailParser = ($, res) => {
    let mainDom = $("#Table17 tr");
    return {
        title: mainDom.eq(1).find('td').text().trim(),
        subTitle: mainDom.eq(2).find('td').text().trim(),
        origin: '楚天时报',
        originUrl: res.request.uri.href,
        content: mainDom.eq(4).children('#copytext').html(),
        authorName: '',
        editorName: '',
        date: res.headers['last-modified'],
        crawledDate: new Date(),//抓取日期
    };
};

module.exports = {
    taskName: '楚天时报',
    taskInterval: 3 * 60000,
    rateLimit: 1500,
    maxConnections: 1,
    queue: (date = new Date()) => [{
        uri: `http://epaper.cnhubei.com/HTML/ctsb/${moment(date).format('YYYYMMDD')}/`,
        parser: parser_page,
    }],
};
