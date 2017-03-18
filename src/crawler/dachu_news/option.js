/**
 * Created by Berlin on 2017/3/7.
 * 腾讯大楚网 - 地市站，包括
 * 湖北要闻/宜昌/襄阳/黄石/十堰/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
 */

const {isDuplicate} = require('../dbConnection');
const moment = require('moment');
const origin = {key: 'txdcw', name: '腾讯大楚网'};

// 列表解析处理器, 适用: 要闻/宜昌/襄阳/黄石/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
async function parser_common($, res) {
    let newsListDom = $(".mod.newslist li"),
        urlList = [],
        filteredQueueDetail = [];

    //准备待排重的 url 列表
    newsListDom.each(function (index) {
        urlList.push($(this).children('a').attr('href'));
    });

    await isDuplicate(urlList).then(isDuplicateResult => {
            isDuplicateResult.forEach((isDuplicate, index) => {
                if (!isDuplicate) {
                    let currentListDom = newsListDom.eq(index);
                    let tempListItem = {
                        _id: '',//list document 唯一id
                        title: currentListDom.children('a').text(),//文章标题
                        uri: currentListDom.children('a').attr('href'),//文章链接
                        date: new Date(moment(currentListDom.children('span').text(), 'MM月DD HH:mm')),//文章发布日期时间戳
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
}
// 适用: 十堰
async function parser_shiyan($, res) {
    let newsListDom = $("ul.list01 li"),
        urlList = [],
        filteredQueueDetail = [];

    newsListDom.each(function (index) {
        urlList.push($(this).children('a').attr('href'));
    });

    await isDuplicate(urlList).then(isDuplicateResult => {
        isDuplicateResult.forEach((isDuplicate, index) => {
            if (!isDuplicate) {
                let currentListDom = newsListDom.eq(index);
                let tempListItem = {
                    _id: '',//list document 唯一id
                    title: currentListDom.children('a').text(),//文章标题
                    uri: currentListDom.children('a').attr('href'),//文章链接
                    date: new Date(moment(currentListDom.children('span').text(), 'MM月DD HH:mm')),//文章发布日期时间戳
                    origin_name: origin.name,//文章来源、出处
                    origin_key: origin.key,//指向 origin collection 中对应的 document id
                    parser: undefined,//下一步爬取的解析器，isAgain为true时，detailParser无作用。如本解析对象为【版面】，下一步解析对象为【文章列表】，再次为【文章详情】
                    detailParser: detailParser,//对应[详情页]解析函数
                };

                filteredQueueDetail.push(tempListItem);
            }
        });
    });

    return {
        isAgain: false,// list 处理结束
        queue: filteredQueueDetail,
    };
}
// detail parser
const detailParser = ($, res) => {
    if (!!$('body#P-QQ').children('div#Main-P-QQ')) {
        //为高清大图模版
        return hdImgTemplateParse($, res);
    } else {
        let mainDom = $(".main");
        return {
            _id: '',//文章唯一 document id，与对应 list id 相同
            title: mainDom.find('.hd h1').text(),//文章标题
            subTitle: mainDom.eq(2).find('td').text().trim(),//文章副标题
            category: mainDom.find('.hd .tit-bar .color-a-1').text(),//文章分类、子栏目、子版面、子频道
            tags: [],//文章标签、关键词
            url: res.request.uri.href,//文章地址
            content: mainDom.find('.bd #Cnt-Main-Article-QQ').html(),//正文内容
            authorName: mainDom.find('.hd .tit-bar .color-a-3').text(),//作者名
            editorName: mainDom.find('.ft .QQeditor').text(),//编辑姓名
            date: new Date(mainDom.find('.hd .tit-bar .article-time').text()),//文章发布日期时间戳
            crawledDate: new Date(),//抓取日期时间戳
            origin_name: origin.name,//来源、出处名
            origin_key: origin.key,//指向 origin collection 中对应的 document id
        };
    }
};
// 高清大图 detail 模版, 如 http://hb.qq.com/a/20170308/043790.htm
const hdImgTemplateParse = ($, res) => {
    let mainDom = $(".main#Main-P-QQ");
    return {
        _id: '',//文章唯一 document id，与对应 list id 相同
        title: mainDom.children('.title h1').text(),//文章标题
        subTitle: '',//文章副标题
        category: '',//文章分类、子栏目、子版面、子频道
        tags: [],//文章标签、关键词
        url: res.request.uri.href,//文章地址
        content: mainDom.find('#Main-A #picWrap img').html()
        + mainDom.find('#InfoWrap #infoTxtWrap #infoTxt').text(),//正文内容
        authorName: '',//作者名
        editorName: '',//编辑姓名
        date: new Date(mainDom.find('#InfoWrap #infoTxtWrap #time_source span').eq(0).text()),//文章发布日期时间戳
        crawledDate: new Date(),//抓取日期时间戳
        origin_name: mainDom.find('#InfoWrap #infoTxtWrap #time_source span').eq(1).text(),//来源、出处名
        origin_key: '',//指向 origin collection 中对应的 document id
    };
};

module.exports = {
    taskName: origin.name,
    taskInterval: 3 * 60000,
    rateLimit: 1000,
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
