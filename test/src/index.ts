import test from 'ava';
import Redirector from '../../dist/index';
import fetch from 'node-fetch';
import Koa from 'koa';

test.serial('1', async t => {
    const redirector = new Redirector();
    const koa = new Koa();
    koa.use(async (ctx, next) => {
        ctx.body = 'hello';
        await next();
    });
    let server;
    try {
        await redirector.start();
        server = koa.listen(12001);
        await fetch('http://localhost:12000/nihao', {
            method: 'put',
            body: 'http://localhost:12001',
        });
        const res = await fetch('http://localhost:12000/nihao');
        t.is(await res.text(), 'hello');
    } finally {
        await redirector.stop();
        if (server) server.close();
    }
});
