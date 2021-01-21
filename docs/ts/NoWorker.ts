import { Physics } from './Physics';

import { GUI } from './GUI';

import { optimizeScene, setupCamera, loadAxes } from './babylonHelper';

import { LogLevel, clog } from './utils';

export class NoWorker {
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

  private _physics = new Physics();

  private _instancedMeshes = new Array<BABYLON.InstancedMesh>();

  constructor() {
    clog('NoWorker', LogLevel.Info);

    optimizeScene(this._scene);
    setupCamera(this._camera, this._canvas);
    this.loadEnvironment();
    this.setupGUI();
    loadAxes(this._scene);

    this._physics.onPhysicsUpdate = (motionStates, physicsStepComputeTime) => {
      for (const [i, motionState] of motionStates.entries()) {
        if (motionState === undefined) {
          break;
        }

        const { position, rotation } = motionState;
        const instancedMesh = this._instancedMeshes[i];

        if (instancedMesh.rotationQuaternion === undefined) {
          instancedMesh.rotationQuaternion = new BABYLON.Quaternion();
        }

        instancedMesh.position.set(position.x, position.y, position.z);
        instancedMesh.rotationQuaternion?.set(rotation.x, rotation.y, rotation.z, rotation.w);
      }

      this._gui.updatePhysicsStepComputeTime(physicsStepComputeTime);
    };

    this._scene.registerBeforeRender(() => {
      this._physics.onRenderUpdate(this._engine.getDeltaTime() / 1000);
    });

    this._engine.runRenderLoop(() => {
      this._scene.render();
      this._gui.update();
    });

    window.onresize = () => {
      this._engine.resize();
    };
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

      this._physics.add(numToAdd);
    };
    this._gui.datData.remove = () => {
      clog('Remove', LogLevel.Debug);

      this._instancedMeshes.forEach(instancedMesh => {
        instancedMesh.dispose();
      });

      this._physics.remove();
    };
    this._gui.datData.numToAdd = 500;
    this._gui.datData.physicsStepComputeTime = 0;
    this._gui.init();

    mesh.setEnabled(false);
  }
}
