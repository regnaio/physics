import { NoWorkerBabylon } from './NoWorkerBabylon';
import { NoWorker } from './NoWorker';
import { WithWorker } from './WithWorker';
import { WithWorkerSAB } from './WithWorkerSAB';
import { WithWorkerSABPM } from './WithWorkerSABPM';
import { WithWorkerSABAtomics } from './WithWorkerSABAtomics';
import { WithWorkerSABTest } from './WithWorkerSABTest';

import { LogLevel, clog } from './utils';

const parts = window.location.pathname.split('/');
const route = parts.pop() || parts.pop();

clog(`route: ${route}`, LogLevel.Info);

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
  case 'withworkersab':
    new WithWorkerSAB();
    break;
  case 'withworkersabpm':
    new WithWorkerSABPM();
    break;
  case 'withworkersabatomics':
    new WithWorkerSABAtomics();
    break;
  case 'withworkersabtest':
    new WithWorkerSABTest();
    break;
  default:
    clog(`Invalid route ${route}`, LogLevel.Error);
}
