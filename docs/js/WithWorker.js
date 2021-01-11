import { LogLevel, clog } from './utils';
export class WithWorker {
    constructor() {
        this._canvas = document.getElementById('renderCanvas');
        this._engine = new BABYLON.Engine(this._canvas);
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 2, 5, new BABYLON.Vector3(), this._scene);
        this._light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);
        clog('WithWorker', LogLevel.Info);
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        window.onresize = () => {
            this._engine.resize();
        };
    }
}
//# sourceMappingURL=WithWorker.js.map