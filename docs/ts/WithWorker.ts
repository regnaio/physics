import { LogLevel, clog } from './utils';

export class WithWorker {
  private _canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  private _engine = new BABYLON.Engine(this._canvas);
  private _scene = new BABYLON.Scene(this._engine);
  private _camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 2, 5, new BABYLON.Vector3(), this._scene);
  private _light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);

  constructor() {
    clog('WithWorker', LogLevel.Info);

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
    
    window.onresize = () => {
      this._engine.resize();
    }
  }
}
