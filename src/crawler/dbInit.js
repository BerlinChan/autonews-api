/**
 * Created by berlin on 2017/3/15.
 * 处理数据库连接与数据读写
 */

const config = require('../utils/config');
const monk = require('monk');
const db = monk(config.DB_SERVER);
const colors = require('colors');

// reCreate collection & index
async function initDb() {
    await db.get('origin').drop()
        .then(result => {
            return db.get('origin').insert(
                [
                    {"_id": monk.id("58cb5e1237e1e826b4530627"), "key": "ctdsb", "name": "楚天都市报"},
                    {"_id": monk.id("58cb5e1237e1e826b4530628"), "key": "hbrb", "name": "湖北日报"},
                    {"_id": monk.id("58cb5e1237e1e826b4530629"), "key": "sxwb", "name": "三峡晚报"},
                    {"_id": monk.id("58cb5e1237e1e826b453062a"), "key": "ctkb", "name": "楚天快报"},
                    {"_id": monk.id("58cb5e1237e1e826b453062b"), "key": "ctjb", "name": "楚天金报"},
                    {"_id": monk.id("58cb5e1237e1e826b453062c"), "key": "txdcw", "name": "腾讯大楚网"},
                    {"_id": monk.id("58cb5e1237e1e826b453062d"), "key": "ctsb", "name": "楚天时报"},
                ]
            );
        })
        .then(result => {
            console.log('Create collection:', 'origin'.yellow, ' OK.');
        });
    await db.get('detail').drop()
        .then(result => {
            db.get('detail').index({'origin_key': 1});
            db.get('detail').index({'date': 1});
        })
        .then(result => {
            console.log('Create collection:', 'detail'.yellow, ' OK.');
        });
    await db.get('list').drop()
        .then(result => {
            db.get('list').index({'origin_key': 1});
            db.get('list').index({'date': 1});
        })
        .then(result => {
            console.log('Create collection:', 'list'.yellow, ' OK.');
        });
    await db.get('requestedUrl').drop()
        .then(result => {
            return db.get('requestedUrl').index({'url': 1});
        })
        .then(reusult => {
            db.create("requestedUrl", {capped: true, size: 209715200});//记录已请求url collection，大小：200MB
        })
        .then(result => {
            console.log('Create collection:', 'requestedUrl'.yellow, ' OK.');
        });
    await db.close();
}

initDb().then(result => {
    console.log('DB init complete.'.green); // outputs green text
    process.exit(0);
});
