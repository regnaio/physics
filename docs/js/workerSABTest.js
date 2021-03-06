import { Physics } from './PhysicsTest';
import { LogLevel, LogCategory, cblog, now } from './utils';
importScripts('../lib/ammo/ammo.wasm.js');
cblog('worker: requestAnimationFrame:', LogLevel.Info, LogCategory.Worker, requestAnimationFrame);
let dataF32SAB;
const physics = new Physics();
cblog('worker: physics:', LogLevel.Info, LogCategory.Worker, physics);
let prevTime = now();
// setInterval(() => {
//   const currTime = now();
//   const deltaTime = currTime - prevTime;
//   // cblog(`worker: physicsLoop(): deltaTime: ${deltaTime}`, LogLevel.Debug, LogCategory.Worker);
//   physics.onRenderUpdate(1 / 60);
//   prevTime = currTime;
// }, 1000 / 60);
// Below causes spiral of death capped by _maxSteps, because onRenderUpdate cannot recover from 4 steps to 1 by itself
// function physicsLoop(): void {
//   const currTime = now();
//   const deltaTime = currTime - prevTime;
//   // cblog(`worker: physicsLoop(): deltaTime: ${deltaTime}`, LogLevel.Debug, LogCategory.Worker);
//   physics.onRenderUpdate(deltaTime / 1000, dataF32SAB);
//   const physicsStepComputeTime = dataF32SAB === undefined ? 0 : dataF32SAB[1];
//   const difference = 1000 / 60 - physicsStepComputeTime;
//   const timeoutDuration = difference < 0 ? 0 : difference;
//   prevTime = currTime;
//   setTimeout(physicsLoop, timeoutDuration);
//   // requestAnimationFrame(physicsLoop);
// }
// physicsLoop();
// // requestAnimationFrame(physicsLoop);
const fixedTimeStep = 1 / 60;
let accumulator = 0;
function physicsLoop() {
    const currTime = now();
    const deltaTime = (currTime - prevTime) / 1000;
    accumulator += deltaTime;
    // if instead of while, which causes spiral of death (deltaTime and # of physics steps per call keeps growing)
    if (accumulator > fixedTimeStep) {
        physics.onRenderUpdate(fixedTimeStep);
        // good for limited FPS, prevents slow down
        // bad for uncapped FPS, unbounded accumulator causes physics speed up when physics step simulation time decreases
        // accumulator -= fixedTimeStep;
        // good for uncapped FPS, prevents physics speed up when physics step simulation time decreases by resetting accumulator
        // bad for limited FPS, causes slow down
        accumulator = 0;
    }
    prevTime = currTime;
    requestAnimationFrame(physicsLoop);
}
requestAnimationFrame(physicsLoop);
self.onmessage = (ev) => {
    cblog('worker: self.onmessage(): ev:', LogLevel.Debug, LogCategory.Worker, ev);
    if (ev.data instanceof SharedArrayBuffer) {
        dataF32SAB = new Float32Array(ev.data);
        physics.add((dataF32SAB.length - 2) / 7);
    }
    else {
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
