/**
 * Created by Berlin on 2017/3/7.
 * 三峡晚报
 */

const moment = require('moment');
const Seenreq = require('seenreq');// for remove duplicate news
const seen = new Seenreq();

// 列表解析处理器, 适用: 宜昌/襄阳/黄石/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
const parser_common = ($, res) => {
    let newsListDom = $(".mod.newslist li");
    let tempQueueDetail = [];
    newsListDom.each(function (index) {
        tempQueueDetail.push({
            title: $(this).children('a').text(),//文章标题
            url: $(this).children('a').attr('href'),//文章链接
            date: $(this).children('span').text(),//文章发布日期
            origin: $('title').text(),//文章来源
            originUrl: res.request.uri.href,//来源链接
            isCrawled: seen.exists($(this).children('a').attr('href')),//是否已采集
            detailParser: detailParser,//对应[详情页]解析函数
        });
    });

    return tempQueueDetail;
};
// 适用: 十堰
const parser_shiyan = ($, res) => {
    let newsListDom = $("ul.list01 li");
    let tempQueueDetail = [];
    newsListDom.each(function (index) {
        tempQueueDetail.push({
            title: $(this).children('a').text(),
            url: $(this).children('a').attr('href'),
            date: $(this).children('span').text(),
            origin: $('title').text(),
            originUrl: res.request.uri.href,
            isCrawled: seen.exists($(this).children('a').attr('href')),
            detailParser: detailParser,
        });
    });

    return tempQueueDetail;
};
// detail parser
const detailParser = ($, res) => {
    let mainDom = $(".main");
    return {
        title: mainDom.find('.hd h1').text(),
        origin: mainDom.find('.hd .tit-bar .color-a-1').text(),
        originUrl: res.request.uri.href,
        //content: mainDom.find('.bd #Cnt-Main-Article-QQ').html(),
        authorName: mainDom.find('.hd .tit-bar .color-a-3').text(),
        editorName: mainDom.find('.ft .QQeditor').text(),
        date: mainDom.find('.hd .tit-bar .article-time').text(),
    };
};

let dateString = moment(new Date()).format('YYSS');//YYMMDD

module.exports = [
    {uri: `http://sxwb.cnhubei.com/html/sxwb/${dateString}/index.html`, listParser: parser_common},
];//新闻目录页面地址
