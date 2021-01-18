import { Physics } from './Physics';
import { LogLevel, LogCategory, cblog } from './utils';
importScripts('../lib/ammo/ammo.wasm.js');
cblog(`worker self.location`, LogLevel.Info, LogCategory.Worker, self.location);
const { origin } = self.location;
cblog(`worker origin: ${origin}`, LogLevel.Info, LogCategory.Worker);
const physics = new Physics(`${origin}/lib/ammo/ammo.wasm.wasm`);
cblog('physics', LogLevel.Info, LogCategory.Worker, physics);
self.onmessage = (ev) => {
    cblog('worker self.onmessage(): ev', LogLevel.Debug, LogCategory.Worker, ev);
};
self.postMessage('hi');
//# sourceMappingURL=worker.js.map