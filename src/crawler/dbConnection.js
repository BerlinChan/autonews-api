/**
 * Created by berlin on 2017/3/15.
 * Crawler Constructor
 */

const config = require('../utils/config');
const db = require('monk')(config.DB_SERVER);

module.exports = db;


//database init
/*
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
    */
