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

app.use(require('koa-static')('../client/old'));
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
    app.io.broadcast('addNews', {data: ctx.req.body});
}));

io.attach(app);

// socketIO events
app.io.on('connection', (ctx, id) => {
    console.log('connect client, id: ', id);
    app.io.broadcast('connections', {
        numConnections: app.io.connections.size,
    });
});

// handle redux actions
app._io.on('connection', (socket) => {
    socket.on('reduxAction', (action) => {
        if (action.type === 'socket/Monitor_EMIT_REQUESTED') {
            console.log('Got hello data!', action.msg);
            socket.emit('reduxAction', {type: 'Monitor_EMIT_RECEIVED', msg: 'good day!'});
        }
    });
});


app.listen(process.env.PORT || config.HTTP_PORT);
