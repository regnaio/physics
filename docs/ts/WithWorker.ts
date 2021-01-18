import { Physics } from './Physics';

import { GUI } from './GUI';

import { loadAxes } from './babylonHelper';

import { LogLevel, LogCategory, clog, cblog } from './utils';

export class WithWorker {
  private _canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  private _engine = new BABYLON.Engine(this._canvas);
  private _scene = new BABYLON.Scene(this._engine);
  private _camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 100, new BABYLON.Vector3(), this._scene);
  private _light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);

  private _gui = new GUI();

  private _worker?: Worker;

  constructor() {
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

  private setupCamera(): void {
    this._camera.keysUp = [];
    this._camera.keysLeft = [];
    this._camera.keysDown = [];
    this._camera.keysRight = [];
    this._camera.attachControl(this._canvas, false);
    this._camera.setTarget(new BABYLON.Vector3(0, 10, 0));
  }

  private setupWorker(): void {
    this._worker = new Worker('../dist/worker.js');

    this._worker.onmessage = (ev: MessageEvent<any>) => {
      cblog('main _worker.onmessage(): ev', LogLevel.Debug, LogCategory.Main, ev);
    };
    
    this._worker.postMessage('hello');
  }

  private loadEnvironment(): void {}
}
