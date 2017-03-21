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
            "date": {$gte: new Date(Date.parse(beginDate) - 57600000), $lt: new Date(Date.parse(endDate) - 57600000)},
            "origin_key": {$in: origin_key_array}
        },
        {sort: {'date': -1}, fields: '-origin_name'}
    );
}


module.exports = {
    getOrigin: getOrigin,
    getSpecificList: getSpecificList,
};