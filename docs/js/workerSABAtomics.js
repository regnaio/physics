import { Physics } from './Physics';
import { MessageType } from './workerHelper';
import { LogLevel, LogCategory, cblog } from './utils';
importScripts('../lib/ammo/ammo.wasm.js');
let signalI32SAB;
let dataF32SAB;
const physics = new Physics();
cblog('worker: physics:', LogLevel.Info, LogCategory.Worker, physics);
let messageNum = 0;
self.onmessage = (ev) => {
    // cblog('worker: self.onmessage(): ev:', LogLevel.Debug, LogCategory.Worker, ev);
    cblog(`messageNum: ${messageNum}`, LogLevel.Debug, LogCategory.Worker);
    const message = ev.data;
    switch (message.type) {
        // case MessageType.Render:
        //   physics.onRenderUpdate(message.data);
        //   break;
        // case MessageType.Step:
        //   break;
        case MessageType.Add:
            cblog('worker: MessageType.Add', LogLevel.Info, LogCategory.Worker);
            physics.remove();
            dataF32SAB = new Float32Array(message.data);
            physics.add((dataF32SAB.length - 2) / 7);
            // waitLoop();
            break;
        case MessageType.Remove:
            physics.remove();
            break;
        case MessageType.SignalSAB:
            cblog('worker: MessageType.SignalSAB', LogLevel.Info, LogCategory.Worker);
            signalI32SAB = new Int32Array(message.data);
            waitLoop();
            break;
        // case MessageType.DataSAB:
        //   break;
    }
    messageNum++;
};
physics.onPhysicsUpdate = (motionStates, physicsStepComputeTime) => {
    if (signalI32SAB === undefined) {
        cblog('worker: onPhysicsUpdate(): signalSAB === undefined', LogLevel.Warn, LogCategory.Worker);
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
    Atomics.notify(signalI32SAB, 1, 1);
};
async function waitLoop() {
    // cblog('worker: waitLoop()', LogLevel.Debug, LogCategory.Worker);
    // @ts-ignore
    const result = Atomics.waitAsync(signalI32SAB, 0, 0);
    if (result.value === 'not-equal') {
        // The value in the SharedArrayBuffer was not the expected one.
    }
    else {
        const value = await result.value;
        if (value === 'ok') {
            /* notified */
            physics.onRenderUpdate(dataF32SAB === undefined ? 0 : dataF32SAB[0], true);
            waitLoop();
        }
        else {
            /* value is 'timed-out' */
        }
    }
}
