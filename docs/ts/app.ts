import { NoWorkerBabylon } from './NoWorkerBabylon';
import { NoWorker } from './NoWorker';
import { WithWorker } from './WithWorker';

import { LogLevel, clog } from './utils';

const parts = window.location.pathname.split('/');
const route = parts.pop() || parts.pop();

clog('route', LogLevel.Info, route);

switch (route) {
  case 'noworkerbabylon':
    new NoWorkerBabylon();
    break;
  case 'noworker':
    new NoWorker();
    break;
  case 'withworker':
    new WithWorker();
    break;
  default:
    clog(`Invalid route ${route}`, LogLevel.Error);
}