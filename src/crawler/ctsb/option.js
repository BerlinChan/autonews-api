/**
 * Created by berlin on 2017/3/8.
 * 楚天时报
 * http://epaper.cnhubei.com/cache/paper_ctsb.aspx
 */

const S = require('string');
const moment = require('moment');
const {isDuplicate} = require('../dbConnection');
const origin = {key: 'ctsb', name: '楚天时报'};

// page 解析处理器
const parser_page = async($, res) => {
    let queuePage = [];//版面队列
    let title = $('title').text();
    if (title == '楚天时报—楚天时报电子版') {
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
            let date = S(onclickAttr).between('ctsb/', '/ctsb').s;
            let url = 'http://epaper.cnhubei.com/HTML/ctsb/'
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
                    let date = S(onclickAttr).between('ctsb/', '/ctsb').s;
                    let url = 'http://epaper.cnhubei.com/HTML/ctsb/'
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
        title: mainDom.eq(1).find('td').text().trim(),
        subTitle: mainDom.eq(2).find('td').text().trim(),
        url: res.request.uri.href,
        // subCategory: '',//子分类、子栏目、子版面
        origin: origin.name,
        //content: mainDom.eq(4).children('#copytext').html(),
        // authorName: '',
        // editorName: '',
        date: res.headers['last-modified'],
        //crawledDate: new Date(),//抓取日期
    };
};

module.exports = {
    taskName: origin.name,
    taskInterval: 3 * 60000,
    rateLimit: 1500,
    maxConnections: 1,
    queue: (date = new Date()) => [{
        uri: `http://epaper.cnhubei.com/HTML/ctsb/${moment(date).format('YYYYMMDD')}/`,
        parser: parser_page,
    }],
};
