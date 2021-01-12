import './physicsHelper';
import { GUI } from './GUI';
import { LogLevel, clog } from './utils';
export class WithWorker {
    constructor() {
        this._canvas = document.getElementById('renderCanvas');
        this._engine = new BABYLON.Engine(this._canvas);
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 150, new BABYLON.Vector3(), this._scene);
        this._light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);
        this._gui = new GUI();
        clog('WithWorker', LogLevel.Info);
        this.setupCamera();
        this.setupPhysics();
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        window.onresize = () => {
            this._engine.resize();
        };
    }
    setupCamera() {
        this._camera.attachControl(this._canvas, false);
        this._camera.setTarget(new BABYLON.Vector3(0, 10, 0));
    }
    async setupPhysics() {
        try {
            if (typeof Ammo === 'function') {
                await Ammo();
            }
        }
        catch (err) {
            clog('setupPhysics(): err', LogLevel.Fatal, err);
        }
    }
    loadEnvironment() {
    }
}
//# sourceMappingURL=WithWorker.js.map