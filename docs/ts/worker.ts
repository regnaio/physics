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

self.onmessage = (ev: MessageEvent<any>) => {
  cblog('worker: self.onmessage(): ev:', LogLevel.Debug, LogCategory.Worker, ev);

  const message = ev.data as Message;
  switch (message.type) {
    case MessageType.Render:
      physics.onRenderUpdate(message.data);
      break;
    case MessageType.Step:
      break;
    case MessageType.Add:
      physics.add(message.data);
      break;
    case MessageType.Remove:
      physics.remove();
      break;
  }
};

self.postMessage('hi');

physics.onPhysicsUpdate = motionStates => {
  // for (const [i, motionState] of motionStates.entries()) {
  //   if (motionState === undefined) {
  //     break;
  //   }

  //   const { position, rotation } = motionState;
  //   const instancedMesh = this._instancedMeshes[i];

  //   if (instancedMesh.rotationQuaternion === undefined) {
  //     instancedMesh.rotationQuaternion = new BABYLON.Quaternion();
  //   }

  //   instancedMesh.position.set(position.x, position.y, position.z);
  //   instancedMesh.rotationQuaternion?.set(rotation.x, rotation.y, rotation.z, rotation.w);
  // }

  const message: Message = {
    type: MessageType.Step,
    data: motionStates
  }
  self.postMessage(message);
};
