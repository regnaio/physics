import { GUI } from './GUI';

import { MessageType, Message } from './workerHelper';

import { optimizeScene, setupCamera, loadAxes } from './babylonHelper';

import { NUM_BYTES_INT32, NUM_BYTES_FLOAT32 } from './binaryHelper';

import { LogLevel, LogCategory, clog, cblog } from './utils';

export class WithWorkerSABAtomics {
  private _canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  private _engine = new BABYLON.Engine(this._canvas);
  private _scene = new BABYLON.Scene(this._engine, {
    useGeometryUniqueIdsMap: true,
    useMaterialMeshMap: true,
    useClonedMeshMap: true
  });
  private _camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 100, new BABYLON.Vector3(), this._scene);
  private _light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);

  private _gui = new GUI();

  private _worker = new Worker('../dist/workerSABAtomics.js');

  private _instancedMeshes = new Array<BABYLON.InstancedMesh>();

  private _signalSAB = new SharedArrayBuffer(NUM_BYTES_INT32 * 2);
  private _dataSAB = new SharedArrayBuffer(0);

  // _signalSAB holds 2 Int32, 1 for each the main thread and worker to watch and signal updates to each other
  private _signalI32SAB = new Int32Array(this._signalSAB);
  private _dataF32SAB = new Float32Array(this._dataSAB);

  constructor() {
    clog('WithWorkerSABATomics', LogLevel.Info);

    optimizeScene(this._scene);
    setupCamera(this._camera, this._canvas);
    this.setupWorker();
    this.setupGUI();
    this.loadEnvironment();
    loadAxes(this._scene);

    this._scene.registerBeforeRender(() => {
      this._dataF32SAB[0] = this._engine.getDeltaTime() / 1000;
      Atomics.notify(this._signalI32SAB, 0, 1);
    });

    this._engine.runRenderLoop(() => {
      this._scene.render();
      this._gui.update();
    });

    window.onresize = () => {
      this._engine.resize();
    };
  }

  private setupWorker(): void {
    const message: Message = {
      type: MessageType.SignalSAB,
      data: this._signalSAB
    };
    this._worker.postMessage(message);

    this.waitLoop();
  }

  private async waitLoop(): Promise<void> {
    // cblog('main: waitLoop()', LogLevel.Debug, LogCategory.Main);
    // @ts-ignore
    const result = Atomics.waitAsync(this._signalI32SAB, 1, 0);

    if (result.value === 'not-equal') {
      // The value in the SharedArrayBuffer was not the expected one.
    } else {
      // result.value instanceof Promise; // true
      // result.value.then(value => {
      //   if (value == 'ok') {
      //     /* notified */
      //   } else {
      //     /* value is 'timed-out' */
      //   }
      // });

      const value = await result.value;
      if (value === 'ok') {
        /* notified */
        this.onPhysicsUpdate();
        this.waitLoop();
      } else {
        /* value is 'timed-out' */
      }
    }
  }

  private loadEnvironment(): void {
    const ground = BABYLON.MeshBuilder.CreateBox('', { width: 50, height: 1, depth: 50 }, this._scene);
    const groundMaterial = new BABYLON.StandardMaterial('', this._scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    groundMaterial.freeze();
    ground.material = groundMaterial;
    ground.position.y -= 0.5;
    ground.freezeWorldMatrix();

    const slide = BABYLON.MeshBuilder.CreateBox('', { width: 10, height: 1, depth: 20 }, this._scene);
    const slideMaterial = new BABYLON.StandardMaterial('', this._scene);
    slideMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    slideMaterial.freeze();
    slide.material = slideMaterial;
    slide.position.x -= 10;
    slide.rotationQuaternion = new BABYLON.Vector3(-Math.PI / 6, 0, 0).toQuaternion();
    slide.freezeWorldMatrix();
  }

  private setupGUI(): void {
    const mesh = BABYLON.MeshBuilder.CreateBox('', { width: 0.5 }, this._scene);
    const material = new BABYLON.StandardMaterial('', this._scene);
    material.diffuseColor = new BABYLON.Color3(1, 1, 0);
    mesh.material = material;

    this._gui.datData.add = () => {
      clog('Add', LogLevel.Debug);
      this._gui.datData.remove();

      const { numToAdd } = this._gui.datData;
      for (let i = 0; i < numToAdd; i++) {
        const instancedMesh = mesh.createInstance('');
        instancedMesh.rotationQuaternion = new BABYLON.Quaternion();

        this._instancedMeshes[i] = instancedMesh;
      }

      // deltaTime + physicsStepComputeTime + (position xyz + rotation xyzw) * numToAdd
      this._dataSAB = new SharedArrayBuffer(NUM_BYTES_FLOAT32 * (2 + 7 * numToAdd));
      this._dataF32SAB = new Float32Array(this._dataSAB);
      // const message: Message = {
      //   type: MessageType.DataSAB,
      //   data: this._dataSAB
      // };
      // this._worker.postMessage(message);
      
      const message: Message = {
        type: MessageType.Add,
        data: this._dataSAB
      };
      this._worker.postMessage(message);
    };

    this._gui.datData.remove = () => {
      clog('Remove', LogLevel.Debug);

      this._instancedMeshes.forEach(instancedMesh => {
        instancedMesh.dispose();
      });

      const message: Message = {
        type: MessageType.Remove,
        data: undefined
      };
      this._worker.postMessage(message);
    };

    this._gui.datData.numToAdd = 500;
    this._gui.datData.physicsStepComputeTime = 0;

    this._gui.init();

    mesh.setEnabled(false);
  }

  private onPhysicsUpdate(): void {
    // cblog('main: onPhysicsUpdate()', LogLevel.Debug, LogCategory.Main, this._dataF32SAB[2]);
    let f32Index = 1;
    let instancedMeshIndex = 0;
    // cblog(`main: onPhysicsUpdate(): _dataF32SAB.length: ${this._dataF32SAB.length}`, LogLevel.Debug, LogCategory.Main);
    while (f32Index < this._dataF32SAB.length - 1) {
      // cblog(`main: onPhysicsUpdate(): instancedMeshIndex: ${instancedMeshIndex}`, LogLevel.Debug, LogCategory.Main);
      const instancedMesh = this._instancedMeshes[instancedMeshIndex];
      instancedMesh?.position.set(this._dataF32SAB[++f32Index], this._dataF32SAB[++f32Index], this._dataF32SAB[++f32Index]);
      instancedMesh?.rotationQuaternion?.set(
        this._dataF32SAB[++f32Index],
        this._dataF32SAB[++f32Index],
        this._dataF32SAB[++f32Index],
        this._dataF32SAB[++f32Index]
      );

      // cblog(`main: onPhysicsUpdate(): f32Index: ${f32Index}`, LogLevel.Debug, LogCategory.Main);
      ++instancedMeshIndex;
    }

    this._gui.updatePhysicsStepComputeTime(this._dataF32SAB[1]);
  }
}
