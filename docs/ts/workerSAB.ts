import { Physics } from './Physics';

import { LogLevel, LogCategory, cblog, now } from './utils';

importScripts('../lib/ammo/ammo.wasm.js');

cblog('worker: requestAnimationFrame:', LogLevel.Info, LogCategory.Worker, requestAnimationFrame);

let dataF32SAB: Float32Array;

const physics = new Physics();
cblog('worker: physics:', LogLevel.Info, LogCategory.Worker, physics);

let prevTime = now();

const fixedTimeStep = 1 / 60;
let accumulator = 0;
function physicsLoop(): void {
  const currTime = now();
  const deltaTime = (currTime - prevTime) / 1000;
  accumulator += deltaTime;

  // if instead of while, which causes spiral of death (deltaTime and # of physics steps per call keeps growing)
  if (accumulator > fixedTimeStep) {
    physics.onRenderUpdate(fixedTimeStep, true);

    // good for limited FPS, prevents slow down
    // bad for uncapped FPS, unbounded accumulator causes physics speed up when physics step simulation time decreases
    accumulator -= fixedTimeStep;

    // good for uncapped FPS, prevents physics speed up when physics step simulation time decreases by resetting accumulator
    // bad for limited FPS, causes slow down
    // accumulator = 0; 
  }

  prevTime = currTime;
  requestAnimationFrame(physicsLoop);
}
requestAnimationFrame(physicsLoop);

self.onmessage = (ev: MessageEvent<any>) => {
  cblog('worker: self.onmessage(): ev:', LogLevel.Debug, LogCategory.Worker, ev);

  if (ev.data instanceof SharedArrayBuffer) {
    dataF32SAB = new Float32Array(ev.data as SharedArrayBuffer);
    physics.add((dataF32SAB.length - 2) / 7);
  } else {
    physics.remove();
  }
};

physics.onPhysicsUpdate = (motionStates, physicsStepComputeTime) => {
  if (dataF32SAB === undefined) {
    cblog('worker: onPhysicsUpdate(): dataF32SAB === undefined', LogLevel.Warn, LogCategory.Worker);
    return;
  }

  dataF32SAB[1] = physicsStepComputeTime;

  let f32Index = 1;
  for (const motionState of motionStates) {
    const { position, rotation } = motionState;

    dataF32SAB[++f32Index] = position.x;
    dataF32SAB[++f32Index] = position.y;
    dataF32SAB[++f32Index] = position.z;
    dataF32SAB[++f32Index] = rotation.x;
    dataF32SAB[++f32Index] = rotation.y;
    dataF32SAB[++f32Index] = rotation.z;
    dataF32SAB[++f32Index] = rotation.w;
  }
};
