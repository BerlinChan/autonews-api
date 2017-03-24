/**
 * Created by Berlin on 2017/3/25.
 * 武汉晨报
 * http://whcb.cjn.cn/
 */

const S = require('string');
const moment = require('moment');
const origin = {key: 'whcb', name: '武汉晨报'};

// page 解析处理器
function parser_page($, res) {
    let queuePage = [];//版面队列
    let title = $('title').text();
    if (title === '长江日报报业集团_长江网_长江日报_武汉晚报_武汉晨报_电子报_数字报') {
        let pageListDom = $('table[width="610"][height="507"] table[cellspacing="0"][cellpadding="2"] tr');
        pageListDom.each(function (index) {
            if (index < pageListDom.length - 1) {
                let filename = $(this).children('td').eq(0).children('a').attr('href');
                let url = res.request.uri.href.split('node')[0] + (filename.indexOf('/') ? filename.split('/')[0] : filename );
                queuePage.push({
                    uri: url,
                    parser: parser_list,
                });
            } else {
                return null;
            }
        });
    }

    return {
        isAgain: true,// page 处理完再处理 list
        queue: queuePage,
    };
}
// list parser
function parser_list($, res) {
    let newsListDom = $("ul.ul02_l li"),
        filteredQueueDetail = [];

    newsListDom.each(function (index) {
        let yearMonth = S(res.request.uri.href).between('/html/', '/').s;
        let date = yearMonth
            + S(res.request.uri.href).between(yearMonth + '/', '/').s;
        let url = res.request.uri.href.split('node')[0]
            + $(this).children('a').attr('href');

        filteredQueueDetail.push({
            _id: '',//list document 唯一id
            title: $(this).children('a').text(),//文章标题
            uri: url,//文章链接
            date: new Date(moment(date, 'YYYY-MMDD')),//文章发布日期时间戳
            origin_name: origin.name,//文章来源、出处
            origin_key: origin.key,//指向 origin collection 中对应的 document id
            parser: undefined,//下一步爬取的解析器，isAgain为true时，detailParser无作用。如本解析对象为【版面】，下一步解析对象为【文章列表】，再次为【文章详情】
            detailParser: detailParser,//对应[详情页]解析函数
        });
    });

    return {
        isAgain: false,// list 处理结束
        queue: filteredQueueDetail,
    };
}
// detail parser
function detailParser($, res) {
    let mainDom = $("table[width='98%'] > tr");
    let topDom = $("table[height='30']");
    let yearMonth = S(res.request.uri.href).between('/html/', '/').s;
    let date = yearMonth
        + S(res.request.uri.href).between(yearMonth + '/', '/').s;
    let content = mainDom.eq(3).find("img").each(function (index) {
            return $(this).html();
        }) + mainDom.eq(4).find('td.xilan_content_tt').html();

    return {
        _id: '',//文章唯一 document id，与对应 list id 相同
        title: mainDom.eq(0).find('.bt1').text().trim(),//文章标题
        subTitle: mainDom.eq(0).find('.bt2').text().trim(),//文章副标题
        category: topDom.find("td[width='120']").text() + topDom.find('.bt3').text(),//文章分类、子栏目、子版面、子频道
        tags: [],//文章标签、关键词
        url: res.request.uri.href,//文章地址
        content: content,//正文内容
        authorName: '',//作者名
        editorName: '',//编辑姓名
        date: new Date(moment(date, 'YYYY-MMDD')),//文章发布日期时间戳
        crawledDate: new Date(),//抓取日期时间戳
        origin_name: origin.name,//来源、出处名
        origin_key: origin.key,//指向 origin collection 中对应的 document id
    };
}

module.exports = {
    taskName: origin.name,
    taskInterval: 3.2 * 60000,
    rateLimit: 1900,
    maxConnections: 1,
    queue: (date = new Date()) => [{
        uri: `http://whcb.cjn.cn/html/${moment(date).format('YYYY-MM')}/${moment(date).format('DD')}/node_42.htm`,
        parser: parser_page,
    }],
};
