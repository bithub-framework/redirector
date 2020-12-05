import Koa from 'koa';
import Startable from 'startable';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { URL } from 'url';
import { join } from 'path';
import { once } from 'events';
// path 的第一个 “/” 有没有视为等效，第二个 “/” 起视为不等效
const PORT = 12000;
class Redirector extends Startable {
    constructor() {
        super();
        this.koa = new Koa();
        this.map = new Map();
        this.router = new Router();
        this.koa.use(bodyParser({
            enableTypes: ['text'],
        }));
        this.router.put('/:name', async (ctx, next) => {
            try {
                const url = new URL(ctx.request.body);
                this.map.set(ctx.params.name, url);
            }
            catch (e) {
                ctx.status = 400;
            }
            await next();
        });
        this.router.get('/:name/:path*', async (ctx, next) => {
            try {
                const url = new URL(this.map.get(ctx.params.name).href);
                if (ctx.params.path)
                    url.pathname = join(url.pathname, ctx.params.path);
                for (const name in ctx.query)
                    url.searchParams.append(name, ctx.query[name]);
                url.hash = ctx.request.URL.hash;
                ctx.redirect(url.href);
                ctx.status = 307;
            }
            catch (e) {
                ctx.status = 404;
            }
            await next();
        });
        this.koa.use(this.router.routes());
    }
    async _start() {
        this.server = this.koa.listen(PORT);
        await once(this.server, 'listening');
    }
    async _stop() {
        this.server.close();
        await once(this.server, 'close');
    }
}
export { Redirector as default, Redirector, };
//# sourceMappingURL=index.js.map