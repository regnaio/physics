import { NoWorker } from './NoWorker';
import { WithWorker } from './WithWorker';
import { LogLevel, clog } from './utils';
const { pathname } = window.location;
const parts = pathname.split('/');
const route = parts.pop() || parts.pop();
clog('route', LogLevel.Info, route);
switch (pathname) {
    case '/noworker/':
        new NoWorker();
        break;
    case '/withworker/':
        new WithWorker();
        break;
    default:
        clog(`Invalid pathname ${pathname}`, LogLevel.Error);
}
//# sourceMappingURL=app.js.map