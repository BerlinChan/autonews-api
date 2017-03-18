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
//按(开始时间: date，结束时间: date，origin_key: string||array)查询list
function getSpecificList(beginDate = new Date(moment().format('YYYY-MM-DD')), endDate = new Date(moment().format('YYYY-MM-DD')), origin_key='hbrb') {
    return db.get('list').find(
        {"date": {$gte: new Date('2017-03-18T01:30:00.000Z')}},
        {sort: {'date': -1}},
        '-origin_name'// ['-origin_name','-title']
    );
}


module.exports = {
    getOrigin: getOrigin,
    getSpecificList: getSpecificList,
};