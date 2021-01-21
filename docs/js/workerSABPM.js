import { Physics } from './Physics';
import { MessageType } from './workerHelper';
import { LogLevel, LogCategory, cblog } from './utils';
importScripts('../lib/ammo/ammo.wasm.js');
let dataF32SAB;
const physics = new Physics();
cblog('worker: physics:', LogLevel.Info, LogCategory.Worker, physics);
self.onmessage = (ev) => {
    // cblog('worker: self.onmessage(): ev:', LogLevel.Debug, LogCategory.Worker, ev);
    const message = ev.data;
    switch (message.type) {
        case MessageType.Render:
            // cblog('worker: MessageType.Render', LogLevel.Info, LogCategory.Worker);
            if (dataF32SAB === undefined) {
                break;
            }
            physics.onRenderUpdate(dataF32SAB[0], true);
            break;
        // case MessageType.Step:
        //   break;
        case MessageType.Add:
            cblog('worker: MessageType.Add', LogLevel.Info, LogCategory.Worker);
            physics.remove();
            dataF32SAB = new Float32Array(message.data);
            physics.add((dataF32SAB.length - 2) / 7);
            break;
        // case MessageType.Remove:
        //   break;
        // case MessageType.SignalSAB:
        //   break;
        // case MessageType.DataSAB:
        //   break;
    }
};
physics.onPhysicsUpdate = (motionStates, physicsStepComputeTime) => {
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
    const message = {
        type: MessageType.Step,
        data: undefined
    };
    self.postMessage(message);
    // cblog('worker: onPhysicsUpdate(): dataF32SAB[2]', LogLevel.Info, LogCategory.Worker, dataF32SAB[2]);
    // Atomics.notify(signalI32SAB, 1, 1);
};
