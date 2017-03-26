/**
 * Created by Berlin on 2017/3/17.
 */

const config = require('../src/utils/config');
const monk = require('monk');
const db = monk(config.DB_SERVER);
const moment = require('moment');

//查询来源列表
function getOrigin() {
    return db.get('origin').find({});
}
//按(开始时间: date，结束时间: date，origin_key: string)查询list
function getSpecificList(beginDate = new Date(moment().format('YYYY-MM-DD')), endDate = new Date(moment().add({days: 1}).format('YYYY-MM-DD')), origin_key = 'ctdsb,ctjb,ctkb,ctsb,txdcw,hbrb,sxwb') {
    let origin_key_array = origin_key.split(',');
    return db.get('list').find(
        {
            "date": {$gte: new Date(Date.parse(beginDate) - 57600000), $lt: new Date(Date.parse(endDate) - 57600000)}, //减去16小时？
            "origin_key": {$in: origin_key_array}
        },
        {sort: {'date': -1}, fields: '-origin_name'}
    );
}
//按(开始时间: date，结束时间: date，origin_key: string)查询往期数据
function pastInquiry(origin = '', beginDate = new Date(moment().format('YYYY-MM-DD')), endDate = new Date(moment().add({days: 1}).format('YYYY-MM-DD')), keyword = '', pageIndex = 0, pageSize = 20) {
    let origin_key_array = origin.split(',');
    let query = {
        "date": {$gte: new Date(Date.parse(beginDate) - 57600000), $lt: new Date(Date.parse(endDate) - 57600000)}, //减去16小时？
        "origin_key": {$in: origin_key_array},
    };
    if (keyword) {
        //let keyword_array = keyword.split(',');
        query['title'] = eval(`/${keyword}/i`);
    }
    try {
        return db.get('detail').find(
            query,
            {sort: {'date': -1}, fields: '-content', limit: parseInt(pageSize)}
        );
    }
    catch (err) {
        console.log(11,err);
    }
}


module.exports = {
    getOrigin,
    getSpecificList,
    pastInquiry,
};