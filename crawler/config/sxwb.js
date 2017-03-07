/**
 * Created by Berlin on 2017/3/7.
 * 三峡晚报
 */

const moment = require('moment');
const Seenreq = require('seenreq');// for remove duplicate news
const seen = new Seenreq();

// page 解析处理器
const parser_page = ($, res) => {
    let queuePage = [];//版面队列
    let title = $('title').text();
    if (title == '三峡晚报') {
        $('td.info3').each(function (index) {
            let onclickAttr = $(this).attr('onclick');
            if (onclickAttr) {
                queuePage.push({
                    maxConnections: 1,
                    rateLimit: 50000,
                    uri: res.request.uri.href.split('index')[0]
                    + onclickAttr.split('.html')[0].split('\'')[1] + '.html',
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
            let date = $(this).children('a').attr('href').split('/')[5];
            let url = 'http://sxwb.cnhubei.com/html/sxwb/'
                + date + '/'
                + $(this).children('a').attr('href').split('/')[6];
            tempQueueDetail.push({
                maxConnections: 1,
                rateLimit: 50000,
                title: $(this).children('a').text(),//文章标题
                uri: url,//文章链接
                date: moment(date, "YYYYMMDD"),//文章发布日期
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
        subTitle: mainDom.eq(0).text().trim(),
        origin: $('title').text(),
        originUrl: res.request.uri.href,
        content: mainDom.eq(4).find('td div').html(),
        authorName: mainDom.find('.hd .tit-bar .color-a-3').text(),
        editorName: mainDom.find('.ft .QQeditor').text(),
        date: moment(res.request.uri.href.split('/')[5], "YYYYMMDD"),
    };
};

module.exports = {
    getRecentDateList: (date)=> [{
        uri: `http://sxwb.cnhubei.com/html/sxwb/${moment(date).format('YYYYMMDD')}/index.html`,//${moment(date).format('YYYYMMDD')}
        parser: parser_page,
    }],
};
