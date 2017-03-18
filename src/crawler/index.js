/**
 * Created by berlin on 2017/3/6.
 * crawler task runner
 */

const dachu_news_crawler = require("./dachu_news");
const sxwb_crawler = require("./sxwb");
const ctdsb_crawler = require("./ctdsb");
const hbrb_crawler = require("./hbrb");
const ctjb_crawler = require("./ctjb");
const ctkb_crawler = require("./ctkb");
const ctsb_crawler = require("./ctsb");

dachu_news_crawler();
ctdsb_crawler();
ctjb_crawler();
// sxwb_crawler();
// hbrb_crawler();
// ctkb_crawler();
// ctsb_crawler();
