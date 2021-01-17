import { GRAVITY, CollisionFilterGroup, CollisionFilterMask, ActivationState, CollisionFlag } from './physicsHelper';
import { GUI } from './GUI';
import { loadAxes } from './babylonHelper';
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
        this._instancedMeshes = new Array();
        clog('NoWorker', LogLevel.Info);
        this.setupCamera();
        this.setupPhysics();
        loadAxes(this._scene);
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
            restitution: 0.5,
            // @ts-ignore
            group: CollisionFilterGroup.Environment,
            mask: CollisionFilterMask.Environment
        }, this._scene);
        ground.physicsImpostor.physicsBody.setActivationState(ActivationState.DISABLE_DEACTIVATION);
        ground.physicsImpostor.physicsBody.setCollisionFlags(CollisionFlag.CF_STATIC_OBJECT);
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
            restitution: 0.5,
            // @ts-ignore
            group: CollisionFilterGroup.Environment,
            mask: CollisionFilterMask.Environment
        }, this._scene);
        slide.physicsImpostor.physicsBody.setActivationState(ActivationState.DISABLE_DEACTIVATION);
        slide.physicsImpostor.physicsBody.setCollisionFlags(CollisionFlag.CF_STATIC_OBJECT);
    }
    setupGUI() {
        const mesh = BABYLON.MeshBuilder.CreateBox('', { width: 0.5 }, this._scene);
        const material = new BABYLON.StandardMaterial('', this._scene);
        material.diffuseColor = new BABYLON.Color3(1, 1, 0);
        mesh.material = material;
        this._gui.datData.add = () => {
            clog('Add', LogLevel.Debug);
            this._gui.datData.remove();
            const { numToAdd } = this._gui.datData;
            this._instancedMeshes = new Array(numToAdd);
            for (let i = 0; i < numToAdd; i++) {
                const instancedMesh = mesh.createInstance('');
                instancedMesh.position = new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-10, 10), 50, BABYLON.Scalar.RandomRange(-10, 10));
                instancedMesh.rotationQuaternion = new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-Math.PI, Math.PI), BABYLON.Scalar.RandomRange(-Math.PI, Math.PI), BABYLON.Scalar.RandomRange(-Math.PI, Math.PI)).toQuaternion();
                instancedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(instancedMesh, BABYLON.PhysicsImpostor.BoxImpostor, {
                    mass: 1,
                    friction: 1,
                    restitution: 0.5,
                    // @ts-ignore
                    group: CollisionFilterGroup.Other,
                    mask: CollisionFilterMask.Other
                }, this._scene);
                instancedMesh.physicsImpostor.physicsBody.setActivationState(ActivationState.DISABLE_DEACTIVATION);
                this._instancedMeshes[i] = instancedMesh;
            }
        };
        this._gui.datData.remove = () => {
            clog('Remove', LogLevel.Debug);
            this._instancedMeshes.forEach(instancedMesh => {
                instancedMesh.physicsImpostor?.dispose();
                instancedMesh.dispose();
            });
        };
        this._gui.datData.numToAdd = 500;
        // this._gui.datData.numTotal = 0;
        this._gui.datData.physicsStepComputeTime = 0;
        this._gui.init();
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
}
//# sourceMappingURL=NoWorkerBabylon.js.map