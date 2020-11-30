import Koa from 'koa';
import Startable from 'startable';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { URL } from 'url';
import { Server } from 'http';

// path 的第一个 “/” 有没有视为等效，第二个 “/” 起视为不等效

class Redirector extends Startable {
    private koa = new Koa();
    private map = new Map<string, URL>();
    private router = new Router();
    private server?: Server;

    constructor() {
        super();
        this.koa.use(bodyParser({
            enableTypes: ['text'],
        }));
        this.router.put('/(.*)', async (ctx, next) => {
            try {
                const url = new URL(ctx.request.body);
                this.map.set(ctx.path, url);
            } catch (e) {
                ctx.status = 400;
                console.log(e);
            }
            await next();
        });
        this.router.get('/(.*)', async (ctx, next) => {
            try {
                const url = this.map.get(ctx.path)!;
                console.assert(url);

                for (const name in ctx.query)
                    url.searchParams.append(name, ctx.query[name]);
                ctx.redirect(url.href);
                ctx.status = 307;
            } catch (e) {
                ctx.status = 404;
                console.log(e);
            }
            await next();
        });
        this.koa.use(this.router.routes());
    }

    protected async _start() {
        this.server = this.koa.listen(12000);
    }

    protected async _stop() {
        this.server!.close();
    }
}

export {
    Redirector as default,
    Redirector,
};
