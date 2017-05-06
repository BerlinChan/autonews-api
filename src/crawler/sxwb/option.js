/**
 * Created by Berlin on 2017/3/7.
 * 三峡晚报
 * http://sxwb.cnhubei.com/cache/paper_sxwb.aspx
 */

const S = require('string');
const moment = require('moment');
const origin = {key: 'sxwb', name: '三峡晚报'};

// page 解析处理器
const parser_page =  ($, res) => {
    let queuePage = [];//版面队列
    let title = $('title').text();
    if (title === '三峡晚报') {
        $('td.info3').each(function (index) {
            let onclickAttr = $(this).attr('onclick');
            if (onclickAttr) {
                queuePage.push({
                    uri: res.request.uri.href.split('index')[0]
                    + S(onclickAttr).between('(\'', '\',').s,
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
const parser_list = ($, res) => {
    let newsListDom = $("td[width=300] tr td"),
        filteredQueueDetail = [];

    newsListDom.each(function (index) {
        let onclickAttr = $(this).attr('onclick');
        if (onclickAttr) {
            let date = S(res.request.uri.href).between('html/sxwb/', '/').s;
            let url = 'http://sxwb.cnhubei.com/html/sxwb/'
                + date
                + S(onclickAttr).between(date, 'html').s + 'html';

            filteredQueueDetail.push({
                _id: '',//list document 唯一id
                title: $(this).children('a').text(),//文章标题
                uri: url,//文章链接
                date: new Date(moment(date, 'YYYYMMDD')),//文章发布日期时间戳
                origin_name: origin.name,//文章来源、出处
                origin_key: origin.key,//指向 origin collection 中对应的 document id
                parser: undefined,//下一步爬取的解析器，isAgain为true时，detailParser无作用。如本解析对象为【版面】，下一步解析对象为【文章列表】，再次为【文章详情】
                detailParser: detailParser,//对应[详情页]解析函数
            });
        }
    });

    return {
        isAgain: false,// list 处理结束
        queue: filteredQueueDetail,
    };
};
// detail parser
const detailParser = ($, res) => {
    let mainDom = $("#Table17 tr");
    let topDom = $('#Table16 tr').eq(0).children('td');
    let titleIndex0 = mainDom.eq(0).find('td').text().trim();
    let date = S(res.request.uri.href).between('html/sxwb/', '/').s;

    return {
        _id: '',//文章唯一 document id，与对应 list id 相同
        title: titleIndex0 ? titleIndex0 : mainDom.eq(1).text().trim(),//文章标题
        subTitle: titleIndex0 ? mainDom.eq(1).text().trim() : mainDom.eq(2).text().trim(),//文章副标题
        category: topDom.eq(0).text() + topDom.eq(2).text(),//文章分类、子栏目、子版面、子频道
        keywords: [],//文章标签、关键词
        url: res.request.uri.href,//文章地址
        content: mainDom.eq(4).find('#copytext').html(),//正文内容
        authorName: '',//作者名
        editorName: '',//编辑姓名
        date: new Date(moment(date, 'YYYYMMDD')),//文章发布日期时间戳
        crawledDate: new Date(),//抓取日期时间戳
        origin_name: origin.name,//来源、出处名
        origin_key: origin.key,//指向 origin collection 中对应的 document id
    };
};

module.exports = {
    taskName: origin.name,
    taskInterval: 3 * 60000,
    rateLimit: 2000,
    maxConnections: 1,
    queue: (date = new Date()) => [{
        uri: `http://sxwb.cnhubei.com/html/sxwb/${moment(date).format('YYYYMMDD')}/index.html`,//${moment(date).format('YYYYMMDD')}
        parser: parser_page,
    }],
};
