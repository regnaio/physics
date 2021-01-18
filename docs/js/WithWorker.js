import { GUI } from './GUI';
import { loadAxes } from './babylonHelper';
import { LogLevel, LogCategory, clog, cblog } from './utils';
export class WithWorker {
    constructor() {
        this._canvas = document.getElementById('renderCanvas');
        this._engine = new BABYLON.Engine(this._canvas);
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 100, new BABYLON.Vector3(), this._scene);
        this._light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);
        this._gui = new GUI();
        clog('WithWorker', LogLevel.Info);
        this.setupCamera();
        loadAxes(this._scene);
        this.setupWorker();
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        window.onresize = () => {
            this._engine.resize();
        };
    }
    setupCamera() {
        this._camera.keysUp = [];
        this._camera.keysLeft = [];
        this._camera.keysDown = [];
        this._camera.keysRight = [];
        this._camera.attachControl(this._canvas, false);
        this._camera.setTarget(new BABYLON.Vector3(0, 10, 0));
    }
    setupWorker() {
        this._worker = new Worker('../dist/worker.js');
        this._worker.onmessage = (ev) => {
            cblog('main _worker.onmessage(): ev', LogLevel.Debug, LogCategory.Main, ev);
        };
        this._worker.postMessage('hello');
    }
    loadEnvironment() { }
}
//# sourceMappingURL=WithWorker.js.map