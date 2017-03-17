/**
 * Created by berlin on 2017/3/15.
 * 处理数据库连接与数据读写
 */

const config = require('../utils/config');
const monk = require('monk');
const db = monk(config.DB_SERVER);


//database init
db.get('origin').insert(
    [
        {key: 'ctdsb', name: '楚天都市报',},
        {key: 'hbrb', name: '湖北日报',},
        {key: 'sxwb', name: '三峡晚报',},
        {key: 'ctkb', name: '楚天快报',},
        {key: 'ctjb', name: '楚天金报',},
        {key: 'txdcw', name: '腾讯大楚网',},
        {key: 'ctsb', name: '楚天时报',}
    ]
);
db.create("requestedUrl", {capped: true, size: 209715200});//记录已请求url collection，大小：200MB
//建立索引
db.get('list').index({'origin_key': 1});
db.get('list').index({'date': 1});
db.get('requestedUrl').index({'url': 1});

console.log('DB init complete.');
