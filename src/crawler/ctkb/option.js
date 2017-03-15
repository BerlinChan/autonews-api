/**
 * Created by berlin on 2017/3/8.
 * 楚天快报
 * http://ctdsbxy.cnhubei.com/cache/paper_ctdsbxy.aspx
 */

const S = require('string');
const moment = require('moment');
const Seenreq = require('seenreq');// for remove duplicate news
const seen = new Seenreq();
const taskName = '楚天快报';

// page 解析处理器
const parser_page = ($, res) => {
    let queuePage = [];//版面队列
    let title = $('title').text();
    if (title == '楚天快报') {
        $('tr td.info3').each(function (index) {
            let onclickAttr = $(this).attr('onclick');
            if (onclickAttr) {
                queuePage.push({
                    uri: res.request.uri.href + S(onclickAttr).between('(\'', '\',').s,
                    pageTitle: $(this).children('a').text(),
                    origin: taskName,
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
            let date = S(onclickAttr).between('ctdsbxy/', '/ctdsbxy').s;
            let url = 'http://ctdsbxy.cnhubei.com/HTML/ctdsbxy/'
                + date + '/'
                + S(onclickAttr).between(date + '/', '\',\'').s;
            tempQueueDetail.push({
                title: $(this).children('a').text(),//文章标题
                uri: url,//文章链接
                date: res.headers['last-modified'],//文章发布日期
                crawledDate: new Date(),//抓取日期
                origin: taskName,//文章来源
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
        url: res.request.uri.href,
        //subCategory: '',//子分类、子栏目、子版面
        origin: taskName,
        //content: mainDom.eq(4).children('#copytext').html(),
        // authorName: '',
        // editorName: '',
        date: res.headers['last-modified'],
        // crawledDate: new Date(),//抓取日期
    };
};

module.exports = {
    taskName: taskName,
    taskInterval: 3 * 60000,
    rateLimit: 1500,
    maxConnections: 1,
    queue: (date = new Date()) => [{
        uri: `http://ctdsbxy.cnhubei.com/HTML/ctdsbxy/${moment(date).format('YYYYMMDD')}/`,
        parser: parser_page,
    }],
};
