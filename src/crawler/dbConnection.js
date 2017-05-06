/**
 * Created by berlin on 2017/3/15.
 * 处理数据库连接与数据读写
 */

const config = require('../utils/config');
const monk = require('monk');
const db = monk(config.DB_SERVER);

//在 list collection 中查询 url是否存在，返回一个数组，每个元素为bool类型，代表是否为duplicate
async function isDuplicate(urlList) {
    const _isDuplicate = async(url) => {
        let isDuplicate = false;
        await db.get('list').findOne({url: url}).then(doc => isDuplicate = !!doc);
        return isDuplicate;
    };
    let promises = urlList.map((url) => _isDuplicate(url));

    return await Promise.all(promises);
}
async function insertListItem(listItem) {
    await db.get('list').insert({
        _id: listItem.id,//list document 唯一id
        title: listItem.title,//文章标题
        url: listItem.uri,//文章链接
        date: listItem.date,//文章发布日期时间戳
        origin_name: listItem.origin_name,//文章来源、出处
        origin_key: listItem.origin_key,//指向 origin collection 中对应的 document id
    });
}
async function insertDetailItem(_id, detailItem) {
    await db.get('detail').insert({
            _id: _id,//文章唯一 document id
            title: detailItem.title,//文章标题
            subTitle: detailItem.subTitle,//文章副标题
            category: detailItem.category,//文章分类、子栏目、子版面、子频道
            keywords: detailItem.keywords,//文章标签、关键词
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

    console.log('insert detail: ' + detailItem.title + (detailItem.subTitle ? detailItem.subTitle : ''));
}


module.exports = {
    db: db,
    isDuplicate: isDuplicate,//检查url是否被抓取过
    insertListItem: insertListItem,//插入 list item 到 list collection
    insertDetailItem: insertDetailItem,//插入 detail item 到 detail collection
};
