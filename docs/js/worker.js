import { Physics } from './Physics';
import { LogLevel, LogCategory, cblog } from './utils';
importScripts('../lib/ammo/ammo.wasm.js');
cblog('worker: self.location:', LogLevel.Info, LogCategory.Worker, self.location);
const { origin, pathname } = self.location;
cblog(`worker: origin: ${origin}`, LogLevel.Info, LogCategory.Worker);
const parts = pathname.split('dist');
cblog('worker: parts:', LogLevel.Info, LogCategory.Worker, parts);
// const index = parts.indexOf('dist');
const extra = parts[0];
if (extra[extra.length - 1] === '/') {
    extra.slice(0, -1);
}
const physics = new Physics(`${origin}/${extra}/lib/ammo/ammo.wasm.wasm`);
cblog('worker: physics:', LogLevel.Info, LogCategory.Worker, physics);
self.onmessage = (ev) => {
    cblog('worker: self.onmessage(): ev:', LogLevel.Debug, LogCategory.Worker, ev);
};
self.postMessage('hi');
//# sourceMappingURL=worker.js.map