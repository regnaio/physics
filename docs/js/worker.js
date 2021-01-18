import { Physics } from './Physics';
import { LogLevel, LogCategory, cblog } from './utils';
importScripts('../lib/ammo/ammo.wasm.js');
cblog('worker: self.location:', LogLevel.Info, LogCategory.Worker, self.location);
const { origin, pathname } = self.location;
cblog(`worker: origin: ${origin}`, LogLevel.Info, LogCategory.Worker);
const parts = pathname.split('dist');
cblog('worker: parts:', LogLevel.Info, LogCategory.Worker, parts);
const extra = parts[0];
cblog(`worker: extra: ${extra}`, LogLevel.Info, LogCategory.Worker);
const wasmPath = new URL('/lib/ammo/ammo.wasm.wasm', new URL(extra, origin)).href;
cblog(`worker: wasmPath: ${wasmPath}`, LogLevel.Info, LogCategory.Worker);
const physics = new Physics(wasmPath);
cblog('worker: physics:', LogLevel.Info, LogCategory.Worker, physics);
self.onmessage = (ev) => {
    cblog('worker: self.onmessage(): ev:', LogLevel.Debug, LogCategory.Worker, ev);
};
self.postMessage('hi');
//# sourceMappingURL=worker.js.map