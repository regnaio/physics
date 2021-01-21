import { Physics } from './Physics';

import { MessageType, Message } from './workerHelper';

import { LogLevel, LogCategory, cblog } from './utils';

importScripts('../lib/ammo/ammo.wasm.js');

// cblog('worker: self.location:', LogLevel.Info, LogCategory.Worker, self.location);

// const { origin, pathname } = self.location;
// cblog(`worker: origin: ${origin}`, LogLevel.Info, LogCategory.Worker);
// cblog(`worker: pathname: ${pathname}`, LogLevel.Info, LogCategory.Worker);

// const parts = pathname.split('dist');
// cblog('worker: parts:', LogLevel.Info, LogCategory.Worker, parts);

// const extra = parts[0];
// cblog(`worker: extra: ${extra}`, LogLevel.Info, LogCategory.Worker);

// const wasmPath = new URL(`${extra}lib/ammo/ammo.wasm.wasm`, origin).href;
// cblog(`worker: wasmPath: ${wasmPath}`, LogLevel.Info, LogCategory.Worker);

// const physics = new Physics(wasmPath);
const physics = new Physics();
cblog('worker: physics:', LogLevel.Info, LogCategory.Worker, physics);

let messageNum = 0;
self.onmessage = (ev: MessageEvent<any>) => {
  // cblog('worker: self.onmessage(): ev:', LogLevel.Debug, LogCategory.Worker, ev);
  // cblog(`messageNum: ${messageNum}`, LogLevel.Debug, LogCategory.Worker);

  const message = JSON.parse(ev.data) as Message;
  switch (message.type) {
    case MessageType.Render:
      physics.onRenderUpdate(message.data);
      break;
    case MessageType.Step:
      break;
    case MessageType.Add:
      physics.add(message.data);
      cblog('WORKER: MessageType.Add', LogLevel.Info, LogCategory.Worker);
      break;
    case MessageType.Remove:
      physics.remove();
      break;
  }

  messageNum++;
};

physics.onPhysicsUpdate = (motionStates, physicsStepComputeTime) => {
  const message: Message = {
    type: MessageType.Step,
    data: {
      motionStates,
      physicsStepComputeTime
    }
  };
  self.postMessage(JSON.stringify(message));
};
