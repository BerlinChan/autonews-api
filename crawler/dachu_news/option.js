/**
 * Created by Berlin on 2017/3/7.
 * 腾讯大楚网 - 地市站，包括
 * 湖北要闻/宜昌/襄阳/黄石/十堰/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
 */

const moment = require('moment');
const Seenreq = require('seenreq');// for remove duplicate news
const seen = new Seenreq();

// 列表解析处理器, 适用: 要闻/宜昌/襄阳/黄石/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
const parser_common = ($, res) => {
    let newsListDom = $(".mod.newslist li");
    let tempQueueDetail = [];
    newsListDom.each(function (index) {
        tempQueueDetail.push({
            title: $(this).children('a').text(),//文章标题
            uri: $(this).children('a').attr('href'),//文章链接
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
            uri: $(this).children('a').attr('href'),
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
        date: moment(mainDom.find('.hd .tit-bar .article-time').text()),
    };
};

module.exports = {
    taskName: '腾讯大楚网-新闻',
    taskInterval: 3 * 60000,
    rateLimit: 0,
    maxConnections: 5,
    queue: [
        {uri: 'http://hb.qq.com/l/news/list20130625101341.htm', parser: parser_common},// 大楚-要闻列表
        {uri: 'http://hb.qq.com/l/yc/list20130619124315.htm', parser: parser_common},// 大楚-宜昌-新闻列表
        {uri: 'http://hb.qq.com/l/xy/list20130619124740.htm', parser: parser_common},// 大楚-襄阳-新闻列表
        {uri: 'http://hb.qq.com/l/hs/list20151231151356.htm', parser: parser_common},// 大楚-黄石-新闻列表
        {uri: 'http://hb.qq.com/l/dachuxiaogan/list201605493502.htm', parser: parser_common},// 大楚-孝感-新闻列表
        {uri: 'http://hb.qq.com/l/qj/list20161223113121.htm', parser: parser_common},// 大楚-潜江-新闻列表
        {uri: 'http://hb.qq.com/l/sz/suizhounews.htm', parser: parser_common},// 大楚-随州-新闻列表
        {uri: 'http://hb.qq.com/l/es/esyw/list20151230161913.htm', parser: parser_common},// 大楚-恩施-新闻列表
        {uri: 'http://hb.qq.com/l/hg/list20151231151003.htm', parser: parser_common},// 大楚-黄冈-新闻列表
        {uri: 'http://hb.qq.com/l/jm/jmyw/jmtt/list2015015104550.htm', parser: parser_common},// 大楚-荆门-新闻列表
        {uri: 'http://hb.qq.com/l/jz/jzyw/jzywlist.htm', parser: parser_common},// 大楚-荆州-新闻列表
        {uri: 'http://hb.qq.com/l/xt/xtyw/list20160127112918.htm', parser: parser_common},// 大楚-仙桃-新闻列表
        {uri: 'http://hb.qq.com/l/sy/synews/shiyan-news-list.htm', parser: parser_shiyan},// 大楚-十堰-新闻列表
    ],
};//新闻目录页面地址
