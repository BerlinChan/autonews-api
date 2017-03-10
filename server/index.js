/**
 * Created by Berlin Local on 2017/3/6.
 * 伺服 Web Client 的 http 服务器
 * 承载 static file 与 API
 */

const Koa = require('koa');
const IO = require('koa-socket');
const cors = require('kcors');
const route = require('koa-route');
const rawBody = require('raw-body');
const config = require('../utils/config');

const app = new Koa();
const io = new IO();

app.use(require('koa-static')('../client/dist'));
app.use(cors({
    origin: 'www.berlinchan.com',
}));

//route
app.use(route.post('/addNews', async function (ctx) {
    ctx.status = 200;
    ctx.req.body = await rawBody(ctx.req, {limit: '100kb', encoding: 'utf8'});
    ctx.req.body = JSON.parse(ctx.req.body);
    ctx.body = {msg: 'success'};
    //broadcast socket event
    const monitorConfig = {
        '1': {key: '1', origin: '楚天都市报',},
        '2': {key: '2', origin: '湖北日报',},
        '3': {key: '3', origin: '三峡晚报',},
        '4': {key: '4', origin: '楚天快报',},
        '5': {key: '6', origin: '楚天金报',},
        '6': {key: '7', origin: '腾讯大楚网',},
        '7': {key: '5', origin: '楚天时报',},
    };
    let key = '';
    for (let i in monitorConfig) {
        if (monitorConfig[i].origin == ctx.req.body.origin) {
            key = i;
            break;
        }
    }
    let tempData = {key: key, origin: monitorConfig[key], news: ctx.req.body};
    app.io.broadcast('action',
        {type: 'socket/Monitor_ON_Socket_News_Added', data: tempData});
}));

io.attach(app);

// koa-socket events
app.io.on('connection', (ctx, id) => {
    console.log('connect client: ', id);
    //广播客户端连接数
    app.io.broadcast('action',
        {type: 'socket/Global_SET_clientCount', data: app.io.connections.size});
    //给 sender 发送 init monitor 配置
    app.io.broadcast('action',
        {
            type: 'socket/Monitor_ON_initMonitorConfigs',
            data: {
                '1': {origin: '楚天都市报',},
                '2': {origin: '湖北日报',},
                '3': {origin: '三峡晚报',},
                '4': {origin: '楚天快报',},
                '5': {origin: '楚天金报',},
                '6': {origin: '腾讯大楚网',},
                '7': {origin: '楚天时报',},
            }
        });
});

// redux actions handler
app.io.on('action', (action) => {
    switch (action.type) {
        case 'socket/demo':
            console.log(action.msg);
            app.io.broadcast('action',
                {type: 'Monitor_EMIT_RECEIVED', msg: 'good day!'});
            break;
        default:
    }
});


app.listen(process.env.PORT || config.HTTP_PORT);
