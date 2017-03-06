/**
 * Created by Berlin Local on 2017/3/6.
 * 伺服 Web Client 的 http 服务器
 * 承载 static file 与 API
 */

const Koa = require('koa');
const IO = require('koa-socket');

const app = new Koa();
const io = new IO();

app.use(require('koa-static')('../client'));

io.attach(app);

io.on('join', (ctx, data) => {
    console.log('join event fired', data);
});

app.listen(process.env.PORT || 3000);