/**
 * Created by berli on 2017/3/21.
 */
const config = require('../utils/config');
const monk = require('monk');
const db = monk(config.DB_SERVER);
const moment = require('moment');

let record1 = (new Date('2017-03-21')).toISOString();
let record2 = new Date('2017-03-21');

db.get('test').insert({
    date1: record1,
    date2: record2
});

console.log('OK');