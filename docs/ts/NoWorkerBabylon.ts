import { GRAVITY, CollisionFilterGroup, CollisionFilterMask } from './physicsHelper';

import { GUI } from './GUI';

import { now, LogLevel, clog } from './utils';

export class NoWorkerBabylon {
  private _canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  private _engine = new BABYLON.Engine(this._canvas, true, {
    deterministicLockstep: true,
    lockstepMaxSteps: 4
  });
  private _scene = new BABYLON.Scene(this._engine);
  private _camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 100, new BABYLON.Vector3(), this._scene);
  private _light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);

  private _gui = new GUI();

  constructor() {
    clog('NoWorker', LogLevel.Info);

    this.setupCamera();
    this.setupPhysics();

    this._engine.runRenderLoop(() => {
      this._scene.render();
      this._gui.update();
    });

    window.onresize = () => {
      this._engine.resize();
    };
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
      const physEngine = new BABYLON.AmmoJSPlugin(false);
      this._scene.enablePhysics(new BABYLON.Vector3(0, GRAVITY, 0), physEngine);

      clog(`_engine.isDeterministicLockStep(): ${this._engine.isDeterministicLockStep()}`, LogLevel.Info);
      clog(`_engine.getLockstepMaxSteps(): ${this._engine.getLockstepMaxSteps()}`, LogLevel.Info);
      clog(`_engine.getTimeStep(): ${this._engine.getTimeStep()}`, LogLevel.Info);
      clog(`physEngine.getTimeStep(): ${physEngine.getTimeStep()}`, LogLevel.Info);
      clog(`_scene.getPhysicsEngine()?.getTimeStep(): ${this._scene.getPhysicsEngine()?.getTimeStep()}`, LogLevel.Info);
      clog(`_scene.getPhysicsEngine()?.getSubTimeStep(): ${this._scene.getPhysicsEngine()?.getSubTimeStep()}`, LogLevel.Info);

      this.loadEnvironment();
      this.setupGUI();
    } catch (err) {
      clog('setupPhysics(): err', LogLevel.Fatal, err);
    }
  }

  private loadEnvironment(): void {
    const slide = BABYLON.MeshBuilder.CreateBox('', { width: 10, height: 20 }, this._scene);
    const slideMaterial = new BABYLON.StandardMaterial('', this._scene);
    slideMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    slideMaterial.freeze();
    slide.material = slideMaterial;
    slide.position.x -= 10;
    slide.rotationQuaternion = new BABYLON.Vector3(Math.PI / 3, 0, 0).toQuaternion();
    slide.freezeWorldMatrix();

    slide.physicsImpostor = new BABYLON.PhysicsImpostor(
      slide,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 0,
        friction: 1,
        // @ts-ignore
        group: CollisionFilterGroup.Environment,
        mask: CollisionFilterMask.Environment
      },
      this._scene
    );
    slide.physicsImpostor.physicsBody.setCollisionFlags(1); // CF_STATIC_OBJECT
    slide.physicsImpostor.physicsBody.setActivationState(5); // DISABLE_SIMULATION

    const ground = BABYLON.MeshBuilder.CreateBox('', { width: 50, height: 1, depth: 50 }, this._scene);
    const groundMaterial = new BABYLON.StandardMaterial('', this._scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    groundMaterial.freeze();
    ground.material = groundMaterial;
    ground.position.y -= 0.5;
    ground.freezeWorldMatrix();

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 0,
        friction: 1,
        // @ts-ignore
        group: CollisionFilterGroup.Environment,
        mask: CollisionFilterMask.Environment
      },
      this._scene
    );
    ground.physicsImpostor.physicsBody.setCollisionFlags(1); // CF_STATIC_OBJECT
    ground.physicsImpostor.physicsBody.setActivationState(5); // DISABLE_SIMULATION
  }

  private setupGUI(): void {
    const mesh = BABYLON.MeshBuilder.CreateBox('', { width: 0.5 }, this._scene);
    const material = new BABYLON.StandardMaterial('', this._scene);
    material.diffuseColor = new BABYLON.Color3(1, 1, 0);
    mesh.material = material;

    const instancedMeshes = new Array<BABYLON.InstancedMesh>(500);
    this._gui.datData = {
      add: () => {
        clog('Add', LogLevel.Debug);

        for (let i = 0; i < 500; i++) {
          const instancedMesh = mesh.createInstance('');

          instancedMesh.position = new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-10, 10), 50, BABYLON.Scalar.RandomRange(-10, 10));

          instancedMesh.rotationQuaternion = new BABYLON.Vector3(
            BABYLON.Scalar.RandomRange(-Math.PI, Math.PI),
            BABYLON.Scalar.RandomRange(-Math.PI, Math.PI),
            BABYLON.Scalar.RandomRange(-Math.PI, Math.PI)
          ).toQuaternion();

          instancedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            instancedMesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            {
              mass: 1,
              friction: 1,
              // @ts-ignore
              group: CollisionFilterGroup.Other,
              mask: CollisionFilterMask.Other
            },
            this._scene
          );
          // instancedMesh.physicsImpostor.physicsBody.setCollisionFlags(1); // CF_STATIC_OBJECT
          // instancedMesh.physicsImpostor.physicsBody.setActivationState(5); // DISABLE_SIMULATION

          instancedMeshes.push(instancedMesh);
        }
      },
      remove: () => {
        clog('Remove', LogLevel.Debug);

        instancedMeshes.forEach(instancedMesh => {
          instancedMesh.physicsImpostor?.dispose();
          instancedMesh.dispose();
        });
      },
      physicsStepComputeTime: 0
    };

    mesh.setEnabled(false);

    let shouldUpdate = false;
    setInterval(() => {
      shouldUpdate = true;
    }, 100);

    let beforeStepTime = now();
    this._scene.onBeforeStepObservable.add(() => {
      const current = now();
      const betweenStepsDuration = current - beforeStepTime;
      beforeStepTime = current;
    });

    this._scene.onAfterStepObservable.add(() => {
      const current = now();
      const stepDuration = current - beforeStepTime;
      if (shouldUpdate) {
        this._gui.updatePhysicsStepComputeTime(stepDuration);
        shouldUpdate = false;
      }
    });
  }
}
