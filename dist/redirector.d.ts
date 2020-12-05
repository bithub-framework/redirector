import Startable from 'startable';
declare class Redirector extends Startable {
    private koa;
    private map;
    private router;
    private server?;
    constructor();
    protected _start(): Promise<void>;
    protected _stop(): Promise<void>;
}
export { Redirector as default, Redirector, };
