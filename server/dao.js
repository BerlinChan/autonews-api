/**
 * Created by Berlin on 2017/3/17.
 */

const config = require('../src/utils/config');
const monk = require('monk');
const db = monk(config.DB_SERVER);

function getOrigin() {
    return db.get('origin').find({});
}
function getCurrentDayList() {
    return db.get('list').find({});
}


module.exports = {
    getOrigin: getOrigin,
};