/**
 * Created by Berlin on 2017/3/7.
 * 腾讯大楚网 - 地市站，包括
 * 宜昌/襄阳/黄石/十堰/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
 */

const Seenreq = require('seenreq');//remove duplicate news
const seen = new Seenreq();

// 列表解析处理器, 适用: 宜昌/襄阳/黄石/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
const processor_common = ($, res) => {
    let newsListDom = $(".mod.newslist li");
    let tempQueueDetail = [];
    newsListDom.each(function (index) {
        tempQueueDetail.push({
            title: $(this).children('a').text(),
            url: $(this).children('a').attr('href'),
            date: $(this).children('span').text(),
            origin: $('title').text(),
            originUrl: res.request.uri.href,
            isCrawled: seen.exists($(this).children('a').attr('href')),
        });
    });

    return tempQueueDetail;
};
// 适用: 十堰
const processor_shiyan = ($, res) => {
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
        });
    });

    return tempQueueDetail;
};

module.exports = [
    {uri: 'http://hb.qq.com/l/yc/list20130619124315.htm', processor: processor_common},// 大楚-宜昌-新闻列表
    {uri: 'http://hb.qq.com/l/xy/list20130619124740.htm', processor: processor_common},// 大楚-襄阳-新闻列表
    {uri: 'http://hb.qq.com/l/hs/list20151231151356.htm', processor: processor_common},// 大楚-黄石-新闻列表
    {uri: 'http://hb.qq.com/l/dachuxiaogan/list201605493502.htm', processor: processor_common},// 大楚-孝感-新闻列表
    {uri: 'http://hb.qq.com/l/qj/list20161223113121.htm', processor: processor_common},// 大楚-潜江-新闻列表
    {uri: 'http://hb.qq.com/l/sz/suizhounews.htm', processor: processor_common},// 大楚-随州-新闻列表
    {uri: 'http://hb.qq.com/l/es/esyw/list20151230161913.htm', processor: processor_common},// 大楚-恩施-新闻列表
    {uri: 'http://hb.qq.com/l/hg/list20151231151003.htm', processor: processor_common},// 大楚-黄冈-新闻列表
    {uri: 'http://hb.qq.com/l/jm/jmyw/jmtt/list2015015104550.htm', processor: processor_common},// 大楚-荆门-新闻列表
    {uri: 'http://hb.qq.com/l/jz/jzyw/jzywlist.htm', processor: processor_common},// 大楚-荆州-新闻列表
    {uri: 'http://hb.qq.com/l/xt/xtyw/list20160127112918.htm', processor: processor_common},// 大楚-仙桃-新闻列表
    {uri: 'http://hb.qq.com/l/sy/synews/shiyan-news-list.htm', processor: processor_shiyan},// 大楚-十堰-新闻列表
];//新闻目录页面地址
