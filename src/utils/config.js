/**
 * Created by Berlin Chan on 2017/3/7.
 * 全局配置
 */

module.exports = {
    HTTP_PORT: 3090,//HTTP server port
    CRAWL_INTERVAL: 3 * 60000, //开始新一轮抓取间隔时间，单位：ms
    DB_SERVER: 'mongodb://10.0.75.1:27017/auto-news',// docker: Mac<host's ip> Win<vEthernet IPv4>
};
