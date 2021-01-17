import { Physics } from './Physics';

import { LogLevel, cblog } from './utils';

importScripts('../lib/ammo/ammo.wasm.js');

const origin = self.location.origin;
cblog(`worker origin: ${origin}`, LogLevel.Info);

const physics = new Physics(`${origin}/lib/ammo/ammo.wasm.wasm`);
cblog('physics', LogLevel.Info, physics);

self.onmessage = (ev: MessageEvent<any>) => {
  cblog('worker self.onmessage(): ev', LogLevel.Debug, ev);
  // console.log('worker self.onmessage(): ev', ev);
  // console.log('worker self.onmessage(): ev.data', ev.data);

  // @ts-ignore
  // const { origin } = ev.currentTarget.location;
  // console.log('worker origin', origin);
  // importScripts(`${origin}/lib/ammo/ammo.wasm.js`);
  // console.log('Ammo', Ammo);

  // const physics = eval('new ' + ev.data + '()');
  // const WorkerPhysics = eval('(' + ev.data + ')');
  // console.log(WorkerPhysics);

  // const physics = new WorkerPhysics() as Physics;
  // const physics = new WorkerPhysics();
};

self.postMessage('hi');
