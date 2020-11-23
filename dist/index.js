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
        this.router.put('/:path*', async (ctx, next) => {
            try {
                const url = new URL(ctx.request.body);
                this.map.set(ctx.path, url.href);
            }
            catch (e) {
                ctx.status = 400;
            }
            await next();
        });
        this.router.get('/:path*', async (ctx, next) => {
            if (this.map.has(ctx.path))
                ctx.redirect(this.map.get(ctx.path));
            else
                ctx.status = 404;
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