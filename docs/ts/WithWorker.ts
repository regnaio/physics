import { GRAVITY, CollisionFilterGroup, CollisionFilterMask } from './physicsHelper';

import { GUI } from './GUI';

import { LogLevel, clog } from './utils';

export class WithWorker {
  private _canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  private _engine = new BABYLON.Engine(this._canvas);
  private _scene = new BABYLON.Scene(this._engine);
  private _camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 150, new BABYLON.Vector3(), this._scene);
  private _light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);

  private _gui = new GUI();

  constructor() {
    clog('WithWorker', LogLevel.Info);

    this.setupCamera();
    this.setupPhysics();

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
    
    window.onresize = () => {
      this._engine.resize();
    }
  }

  private setupCamera(): void {
    this._camera.attachControl(this._canvas, false);
    this._camera.setTarget(new BABYLON.Vector3(0, 10, 0));
  }

  private async setupPhysics(): Promise<void> {
    try {
      if (typeof Ammo === 'function') {
        await Ammo();
      }


    } catch (err) {
      clog('setupPhysics(): err', LogLevel.Fatal, err);
    }
  }

  private loadEnvironment(): void {
    
  }
}
