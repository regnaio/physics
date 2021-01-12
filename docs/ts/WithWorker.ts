import { GRAVITY, CollisionFilterGroup, CollisionFilterMask } from './physicsHelper';

import { GUI } from './GUI';

import { LogLevel, clog } from './utils';

export class WithWorker {
  private _canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  private _engine = new BABYLON.Engine(this._canvas);
  private _scene = new BABYLON.Scene(this._engine);
  private _camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 100, new BABYLON.Vector3(), this._scene);
  private _light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);

  private _gui = new GUI();

  constructor() {
    clog('WithWorker', LogLevel.Info);

    this.setupCamera();
    this.setupPhysics();
    this.loadAxes();

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

  private async setupPhysics(): Promise<void> {
    try {
      if (typeof Ammo === 'function') {
        await Ammo();
      }
    } catch (err) {
      clog('setupPhysics(): err', LogLevel.Fatal, err);
    }
  }

  private loadEnvironment(): void {}

  private loadAxes(): void {
    const size = 100;

    const axisX = BABYLON.Mesh.CreateLines(
      'axisX',
      [
        new BABYLON.Vector3(),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ],
      this._scene
    );
    axisX.isPickable = false;
    axisX.color = new BABYLON.Color3(1, 0, 0);

    const axisY = BABYLON.Mesh.CreateLines(
      'axisY',
      [
        new BABYLON.Vector3(),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
      ],
      this._scene
    );
    axisY.isPickable = false;
    axisY.color = new BABYLON.Color3(0, 1, 0);

    const axisZ = BABYLON.Mesh.CreateLines(
      'axisZ',
      [
        new BABYLON.Vector3(),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
      ],
      this._scene
    );
    axisZ.isPickable = false;
    axisZ.color = new BABYLON.Color3(0, 0, 1);
  }
}
