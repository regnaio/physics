import { NoWorker } from './NoWorker';
import { WithWorker } from './WithWorker';

import { LogLevel, clog } from './utils';

const { pathname } = window.location;

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