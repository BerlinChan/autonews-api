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
const config = require('../src/utils/config');
const {getOrigin, getSpecificList}=require('./DAO');

const app = new Koa();
const io = new IO();

//static serve
app.use(require('koa-static')('../public'));

// Origin verification generator
function verifyOrigin(ctx) {
    let validOrigins = ['http://www.berlinchan.com', 'http://localhost:3091'];

    const origin = ctx.headers.origin;
    if (!(validOrigins.indexOf(origin) != -1)) return false;
    return origin;
}
app.use(cors({origin: verifyOrigin}));

io.attach(app);

//route
app.use(route.get('/getOrigin', async function (ctx) {
    await getOrigin().then(doc => {
        ctx.status = 200;
        ctx.body = {data: doc, msg: 'success'}
    });
}));
app.use(route.get('/getSpecificList', async function (ctx) {
    await getSpecificList().then(doc => {
        ctx.status = 200;
        ctx.body = {data: doc, msg: 'success'}
    });
}));
app.use(route.post('/listItem_added', async function (ctx) {
    ctx.status = 200;
    ctx.req.body = await rawBody(ctx.req, {limit: '10kb', encoding: 'utf8'});
    ctx.req.body = JSON.parse(ctx.req.body);
    ctx.body = {data: undefined, msg: 'success'};
    //broadcast socket event
    app.io.broadcast('action',
        {type: 'socket_Monitor_ON_News_Added', data: ctx.req.body});
}));

// koa-socket events
app.io.on('connection', async(ctx, id) => {
    console.log('connect client: ', id);
    //广播客户端连接数
    app.io.broadcast('action',
        {type: 'socket_Global_SET_clientCount', data: app.io.connections.size});
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
