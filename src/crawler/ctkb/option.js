/**
 * Created by berlin on 2017/3/8.
 * 楚天快报
 * http://ctdsbxy.cnhubei.com/cache/paper_ctdsbxy.aspx
 */

const S = require('string');
const moment = require('moment');
const {isDuplicate} = require('../dbConnection');
const origin = {key: 'ctkb', name: '楚天快报'};

// page 解析处理器
const parser_page = async($, res) => {
    let queuePage = [];//版面队列
    let title = $('title').text();
    if (title == '楚天快报') {
        $('tr td.info3').each(function (index) {
            let onclickAttr = $(this).attr('onclick');
            if (onclickAttr) {
                queuePage.push({
                    uri: res.request.uri.href + S(onclickAttr).between('(\'', '\',').s,
                    pageTitle: $(this).children('a').text(),
                    origin: origin.name,
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
const parser_list = async($, res) => {
    let newsListDom = $("td[width=300] tr td"),
        urlList = [],
        filteredDomIndex = [],
        filteredQueueDetail = [];

    newsListDom.each(function (index) {
        let onclickAttr = $(this).attr('onclick');
        if (onclickAttr) {
            let date = S(onclickAttr).between('ctdsbxy/', '/ctdsbxy').s;
            let url = 'http://ctdsbxy.cnhubei.com/HTML/ctdsbxy/'
                + date + '/'
                + S(onclickAttr).between(date + '/', '\',\'').s;
            urlList.push(url);
            filteredDomIndex.push(index);
        }
    });

    await isDuplicate(urlList).then(isDuplicateResult => {
            isDuplicateResult.forEach((isDuplicate, index) => {
                if (!isDuplicate) {
                    let currentListDom = newsListDom.eq(filteredDomIndex[index]);
                    let onclickAttr = currentListDom.attr('onclick');
                    let date = S(onclickAttr).between('ctdsbxy/', '/ctdsbxy').s;
                    let url = 'http://ctdsbxy.cnhubei.com/HTML/ctdsbxy/'
                        + date + '/'
                        + S(onclickAttr).between(date + '/', '\',\'').s;

                    let tempListItem = {
                        _id: '',//list document 唯一id
                        title: currentListDom.children('a').text(),//文章标题
                        uri: url,//文章链接
                        date: new Date(res.headers['last-modified']),//文章发布日期时间戳
                        origin_name: origin.name,//文章来源、出处
                        origin_key: origin.key,//指向 origin collection 中对应的 document id
                        parser: undefined,//下一步爬取的解析器，isAgain为true时，detailParser无作用。如本解析对象为【版面】，下一步解析对象为【文章列表】，再次为【文章详情】
                        detailParser: detailParser,//对应[详情页]解析函数
                    };

                    filteredQueueDetail.push(tempListItem);
                }
            })
        }
    );

    return {
        isAgain: false,// list 处理结束
        queue: filteredQueueDetail,
    };
};
// detail parser
const detailParser = ($, res) => {
    let mainDom = $("#Table17 tr");
    return {
        _id: '',//文章唯一 document id，与对应 list id 相同
        title: mainDom.eq(1).find('td').text().trim(),//文章标题
        subTitle: mainDom.eq(2).find('td').text().trim(),//文章副标题
        category: '',//文章分类、子栏目、子版面、子频道
        tags: [],//文章标签、关键词
        url: res.request.uri.href,//文章地址
        content: mainDom.eq(4).children('#copytext').html(),//正文内容
        authorName: '',//作者名
        editorName: '',//编辑姓名
        date: new Date(res.headers['last-modified']),//文章发布日期时间戳
        crawledDate: new Date(),//抓取日期时间戳
        origin_name: origin.name,//来源、出处名
        origin_key: origin.key,//指向 origin collection 中对应的 document id
    };
};

module.exports = {
    taskName: origin.name,
    taskInterval: 3 * 60000,
    rateLimit: 1500,
    maxConnections: 1,
    queue: (date = new Date()) => [{
        uri: `http://ctdsbxy.cnhubei.com/HTML/ctdsbxy/${moment(date).format('YYYYMMDD')}/`,
        parser: parser_page,
    }],
};
