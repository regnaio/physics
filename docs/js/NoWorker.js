import { Physics } from './Physics';
import { GUI } from './GUI';
import { now, LogLevel, clog } from './utils';
export class NoWorker {
    constructor() {
        this._canvas = document.getElementById('renderCanvas');
        this._engine = new BABYLON.Engine(this._canvas);
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 100, new BABYLON.Vector3(), this._scene);
        this._light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);
        this._gui = new GUI();
        this._physics = new Physics(this._gui);
        this._instancedMeshes = new Array(500);
        clog('NoWorker', LogLevel.Info);
        this.setupCamera();
        this.loadEnvironment();
        this.setupGUI();
        this.loadAxes();
        this._physics.onPhysicsUpdate = () => {
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
    setupCamera() {
        this._camera.keysUp = [];
        this._camera.keysLeft = [];
        this._camera.keysDown = [];
        this._camera.keysRight = [];
        this._camera.attachControl(this._canvas, false);
        this._camera.setTarget(new BABYLON.Vector3(0, 10, 0));
    }
    loadEnvironment() {
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
    setupGUI() {
        const mesh = BABYLON.MeshBuilder.CreateBox('', { width: 0.5 }, this._scene);
        const material = new BABYLON.StandardMaterial('', this._scene);
        material.diffuseColor = new BABYLON.Color3(1, 1, 0);
        mesh.material = material;
        // const instancedMeshes = new Array<BABYLON.InstancedMesh>(500);
        this._gui.datData = {
            add: () => {
                clog('Add', LogLevel.Debug);
                for (let i = 0; i < 500; i++) {
                    const instancedMesh = mesh.createInstance('');
                    this._physics.add();
                    // instancedMesh.position = new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-50, 50), 50, BABYLON.Scalar.RandomRange(-50, 50));
                    // instancedMesh.rotationQuaternion = new BABYLON.Vector3(
                    //   BABYLON.Scalar.RandomRange(-Math.PI, Math.PI),
                    //   BABYLON.Scalar.RandomRange(-Math.PI, Math.PI),
                    //   BABYLON.Scalar.RandomRange(-Math.PI, Math.PI)
                    // ).toQuaternion();
                    // instancedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
                    //   instancedMesh,
                    //   BABYLON.PhysicsImpostor.BoxImpostor,
                    //   {
                    //     mass: 1,
                    //     friction: 1,
                    //     // @ts-ignore
                    //     group: CollisionFilterGroup.Other,
                    //     mask: CollisionFilterMask.Other
                    //   },
                    //   this._scene
                    // );
                    // instancedMesh.physicsImpostor.physicsBody.setCollisionFlags(1); // CF_STATIC_OBJECT
                    // instancedMesh.physicsImpostor.physicsBody.setActivationState(5); // DISABLE_SIMULATION
                    this._instancedMeshes.push(instancedMesh);
                }
            },
            remove: () => {
                clog('Remove', LogLevel.Debug);
                this._instancedMeshes.forEach(instancedMesh => {
                    // instancedMesh.physicsImpostor?.dispose();
                    instancedMesh.dispose();
                });
            },
            physicsStepComputeTime: 0
        };
        mesh.setEnabled(false);
        let beforeStepTime = now();
        this._scene.onBeforeStepObservable.add(() => {
            const current = now();
            const betweenStepsDuration = current - beforeStepTime;
            beforeStepTime = current;
        });
        this._scene.onAfterStepObservable.add(() => {
            const current = now();
            const stepDuration = current - beforeStepTime;
            this._gui.updatePhysicsStepComputeTime(stepDuration);
        });
    }
    loadAxes() {
        const size = 100;
        const axisX = BABYLON.Mesh.CreateLines('axisX', [
            new BABYLON.Vector3(),
            new BABYLON.Vector3(size, 0, 0),
            new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0),
            new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], this._scene);
        axisX.isPickable = false;
        axisX.color = new BABYLON.Color3(1, 0, 0);
        const axisY = BABYLON.Mesh.CreateLines('axisY', [
            new BABYLON.Vector3(),
            new BABYLON.Vector3(0, size, 0),
            new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0),
            new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        ], this._scene);
        axisY.isPickable = false;
        axisY.color = new BABYLON.Color3(0, 1, 0);
        const axisZ = BABYLON.Mesh.CreateLines('axisZ', [
            new BABYLON.Vector3(),
            new BABYLON.Vector3(0, 0, size),
            new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size),
            new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
        ], this._scene);
        axisZ.isPickable = false;
        axisZ.color = new BABYLON.Color3(0, 0, 1);
    }
}
//# sourceMappingURL=NoWorker.js.map