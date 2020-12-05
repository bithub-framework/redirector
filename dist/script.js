import { adaptor } from 'startable';
import Redirector from './redirector';
const redirector = new Redirector();
adaptor(redirector);
redirector.start().then(() => {
    console.log('Started');
}, () => { });
//# sourceMappingURL=script.js.map