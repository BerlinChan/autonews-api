/**
 * Created by Berlin on 2017/3/17.
 */

const config = require('../src/utils/config');
const monk = require('monk');
const db = monk(config.DB_SERVER);
const moment = require('moment');

function getOrigin() {
    return db.get('origin').find({});
}
function getSpecificList(beginDate = new Date(moment().format('YYYY-MM-DD')), endDate = new Date(moment().format('YYYY-MM-DD')), origin_key) {
    return db.get('list').find({"date": {$gte: new Date('2017-03-17T10:42:00.000Z')}});
}


module.exports = {
    getOrigin: getOrigin,
    getSpecificList: getSpecificList,
};