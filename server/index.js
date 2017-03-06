/**
 * Created by Berlin Local on 2017/3/6.
 * 伺服 Web Client 的 http 服务器
 * 承载 static file 与 API
 */

const Koa = require('koa');
const IO = require('koa-socket');
const route = require('koa-route');
const rawBody = require('raw-body');

const app = new Koa();
const io = new IO();

app.use(require('koa-static')('../client'));

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
app.io.on('connection', (ctx, data) => {
    console.log('connect client, id: ', data);
});

app.listen(process.env.PORT || 3000);
