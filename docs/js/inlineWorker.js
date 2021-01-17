// importScripts('./Physics');
// import { LogLevel, clog } from './utils';
export function inlineWorker() {
    // importScripts('../../lib/ammo/ammo.wasm.js');
    // importScripts('https://cdn.babylonjs.com/ammo.wasm.js')
    // console.log('Ammo', Ammo);
    self.onmessage = (ev) => {
        // clog('worker self.onmessage(): ev', LogLevel.Debug, ev);
        console.log('worker self.onmessage(): ev', ev);
        console.log('worker self.onmessage(): ev.data', ev.data);
        // @ts-ignore
        const { origin } = ev.currentTarget.location;
        console.log('worker origin', origin);
        importScripts(`${origin}/lib/ammo/ammo.wasm.js`);
        console.log('Ammo', Ammo);
        // const physics = eval('new ' + ev.data + '()');
        const WorkerPhysics = eval('(' + ev.data + ')');
        console.log(WorkerPhysics);
        // const physics = new WorkerPhysics() as Physics;
        const physics = new WorkerPhysics();
        console.log(physics);
    };
    self.postMessage('hi');
}
//# sourceMappingURL=inlineWorker.js.map