import Koa from 'koa';
import Startable from 'startable';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { URL } from 'url';
class Redirector extends Startable {
    constructor() {
        super();
        this.koa = new Koa();
        this.map = new Map();
        this.router = new Router();
        this.koa.use(bodyParser());
        this.router.put('/(.*)', async (ctx, next) => {
            try {
                const url = new URL(ctx.request.body);
                this.map.set(ctx.path, url.href);
            }
            catch (e) {
                ctx.status = 400;
            }
            await next();
        });
        this.router.get('/(.*)', async (ctx, next) => {
            try {
                const url = new URL(this.map.get(ctx.path));
                for (const name in ctx.query)
                    url.searchParams.append(name, ctx.query[name]);
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
        this.server = this.koa.listen(12000);
    }
    async _stop() {
        this.server.close();
    }
}
export { Redirector as default, Redirector, };
//# sourceMappingURL=index.js.map