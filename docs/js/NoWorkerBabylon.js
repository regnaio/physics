import { GRAVITY, CollisionFilterGroup, CollisionFilterMask } from './physicsHelper';
import { GUI } from './GUI';
import { now, LogLevel, clog } from './utils';
export class NoWorkerBabylon {
    constructor() {
        this._canvas = document.getElementById('renderCanvas');
        this._engine = new BABYLON.Engine(this._canvas, true, {
            deterministicLockstep: true,
            lockstepMaxSteps: 4
        });
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 100, new BABYLON.Vector3(), this._scene);
        this._light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);
        this._gui = new GUI();
        clog('NoWorker', LogLevel.Info);
        this.setupCamera();
        this.setupPhysics();
        this.loadAxes();
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
    async setupPhysics() {
        var _a, _b;
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
            clog(`_scene.getPhysicsEngine()?.getTimeStep(): ${(_a = this._scene.getPhysicsEngine()) === null || _a === void 0 ? void 0 : _a.getTimeStep()}`, LogLevel.Info);
            clog(`_scene.getPhysicsEngine()?.getSubTimeStep(): ${(_b = this._scene.getPhysicsEngine()) === null || _b === void 0 ? void 0 : _b.getSubTimeStep()}`, LogLevel.Info);
            this.loadEnvironment();
            this.setupGUI();
        }
        catch (err) {
            clog('setupPhysics(): err', LogLevel.Fatal, err);
        }
    }
    loadEnvironment() {
        const ground = BABYLON.MeshBuilder.CreateBox('', { width: 50, height: 1, depth: 50 }, this._scene);
        const groundMaterial = new BABYLON.StandardMaterial('', this._scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        groundMaterial.freeze();
        ground.material = groundMaterial;
        ground.position.y -= 0.5;
        ground.freezeWorldMatrix();
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 1,
            // @ts-ignore
            group: CollisionFilterGroup.Environment,
            mask: CollisionFilterMask.Environment
        }, this._scene);
        ground.physicsImpostor.physicsBody.setCollisionFlags(1); // CF_STATIC_OBJECT
        ground.physicsImpostor.physicsBody.setActivationState(5); // DISABLE_SIMULATION
        const slide = BABYLON.MeshBuilder.CreateBox('', { width: 10, height: 1, depth: 20 }, this._scene);
        const slideMaterial = new BABYLON.StandardMaterial('', this._scene);
        slideMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        slideMaterial.freeze();
        slide.material = slideMaterial;
        slide.position.x -= 10;
        slide.rotationQuaternion = new BABYLON.Vector3(-Math.PI / 6, 0, 0).toQuaternion();
        slide.freezeWorldMatrix();
        slide.physicsImpostor = new BABYLON.PhysicsImpostor(slide, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 1,
            // @ts-ignore
            group: CollisionFilterGroup.Environment,
            mask: CollisionFilterMask.Environment
        }, this._scene);
        slide.physicsImpostor.physicsBody.setCollisionFlags(1); // CF_STATIC_OBJECT
        slide.physicsImpostor.physicsBody.setActivationState(5); // DISABLE_SIMULATION
    }
    setupGUI() {
        const mesh = BABYLON.MeshBuilder.CreateBox('', { width: 0.5 }, this._scene);
        const material = new BABYLON.StandardMaterial('', this._scene);
        material.diffuseColor = new BABYLON.Color3(1, 1, 0);
        mesh.material = material;
        const instancedMeshes = new Array(500);
        this._gui.datData = {
            add: () => {
                clog('Add', LogLevel.Debug);
                for (let i = 0; i < 500; i++) {
                    const instancedMesh = mesh.createInstance('');
                    instancedMesh.position = new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-10, 10), 50, BABYLON.Scalar.RandomRange(-10, 10));
                    instancedMesh.rotationQuaternion = new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-Math.PI, Math.PI), BABYLON.Scalar.RandomRange(-Math.PI, Math.PI), BABYLON.Scalar.RandomRange(-Math.PI, Math.PI)).toQuaternion();
                    instancedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(instancedMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
                        mass: 1,
                        friction: 1,
                        // @ts-ignore
                        group: CollisionFilterGroup.Other,
                        mask: CollisionFilterMask.Other
                    }, this._scene);
                    // instancedMesh.physicsImpostor.physicsBody.setCollisionFlags(1); // CF_STATIC_OBJECT
                    // instancedMesh.physicsImpostor.physicsBody.setActivationState(5); // DISABLE_SIMULATION
                    instancedMeshes.push(instancedMesh);
                }
            },
            remove: () => {
                clog('Remove', LogLevel.Debug);
                instancedMeshes.forEach(instancedMesh => {
                    var _a;
                    (_a = instancedMesh.physicsImpostor) === null || _a === void 0 ? void 0 : _a.dispose();
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
//# sourceMappingURL=NoWorkerBabylon.js.map