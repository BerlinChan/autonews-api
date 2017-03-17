/**
 * Created by berlin on 2017/3/15.
 * 处理数据库连接与数据读写
 */

const config = require('../utils/config');
const monk = require('monk');
const db = monk(config.DB_SERVER);
const request = require('request');// for send a request to HTTP server, push list item to client
const Seenreq = require('seenreq');// for remove duplicate
const seen = new Seenreq();

//返回一个数组，每个元素为bool类型，代表是否为duplicate
async function isDuplicate(urlList) {
    const _isDuplicate = async(url) => {
        let normalizedUrl = seen.normalize(url);
        let isDuplicate = false;
        await db.get('requestedUrl').findOne({url: normalizedUrl}).then(doc => isDuplicate = !!doc);
        return isDuplicate;
    };
    let promises = urlList.map((url) => _isDuplicate(url));

    return await Promise.all(promises);
}
async function insertUrlToDuplicateCollection(url) {
    let normalizedUrl = seen.normalize(url);
    await db.get('requestedUrl').insert({url: normalizedUrl});
}
async function insertList(list = []) {
    let newListRef = [];
    //convert structure
    list.forEach((item, index) => {
        newListRef.push({
            _id: item.id,//list document 唯一id
            title: item.title,//文章标题
            url: item.uri,//文章链接
            date: item.date,//文章发布日期时间戳
            origin_name: item.origin_name,//文章来源、出处
            origin_key: item.origin_key,//指向 origin collection 中对应的 document id
        });

        //通知web客户端
        request({
            method: 'POST',
            url: 'http://localhost:' + config.HTTP_PORT + '/listItem_added',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                title: item.title,
                url: item.uri,
                date: item.date,
                origin_key: item.origin_key,
                key: item.id,
            }),
        }, function callback(error, response, body) {
            if (!error && response.statusCode == 200) {

            } else {
                console.log(error);
            }
        });
    });
    await db.get('list').insert(newListRef);
}
async function insertDetail(id, detailItem) {
    await db.get('detail').insert({
            _id: id,//文章唯一 document id
            title: detailItem.title,//文章标题
            subTitle: detailItem.subTitle,//文章副标题
            category: detailItem.category,//文章分类、子栏目、子版面、子频道
            tags: detailItem.tags,//文章标签、关键词
            url: detailItem.url,//文章地址
            content: detailItem.content,//正文内容
            authorName: detailItem.authorName,//作者名
            editorName: detailItem.editorName,//编辑姓名
            date: detailItem.date,//文章发布日期时间戳
            crawledDate: detailItem.crawledDate,//抓取日期时间戳
            origin_name: detailItem.origin_name,//来源、出处名
            origin_key: detailItem.origin_key,//指向 origin collection 中对应的 document id
        }
    );
    insertUrlToDuplicateCollection(detailItem.url);

    console.log('insert detail: ' + detailItem.title + (detailItem.subTitle ? detailItem.subTitle : ''));
}


module.exports = {
    db: db,
    isDuplicate: isDuplicate,//检查url是否被抓取过
    insertUrlToDuplicateCollection: insertUrlToDuplicateCollection,//检查url是否被抓取过
    insertList: insertList,//插入 list item 到 list collection
    insertDetail: insertDetail,//插入 detail item 到 detail collection
};
