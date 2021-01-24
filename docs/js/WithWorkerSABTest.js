import { GUI } from './GUI';
import { optimizeScene, setupCamera, loadAxes } from './babylonHelper';
import { NUM_BYTES_FLOAT32 } from './binaryHelper';
import { LogLevel, clog, now } from './utils';
export class WithWorkerSABTest {
    constructor() {
        this._canvas = document.getElementById('renderCanvas');
        this._engine = new BABYLON.Engine(this._canvas);
        this._scene = new BABYLON.Scene(this._engine, {
            useGeometryUniqueIdsMap: true,
            useMaterialMeshMap: true,
            useClonedMeshMap: true
        });
        this._camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 100, new BABYLON.Vector3(), this._scene);
        this._light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);
        this._worker = new Worker('../dist/workerSABTest.js');
        this._dataSAB = new SharedArrayBuffer(0);
        this._dataF32SAB = new Float32Array(this._dataSAB);
        this._gui = new GUI();
        this._instancedMeshes = new Array();
        clog('WithWorkerSAB', LogLevel.Info);
        optimizeScene(this._scene);
        setupCamera(this._camera, this._canvas);
        this.setupGUI();
        this.loadEnvironment();
        loadAxes(this._scene);
        const fixedTimeStep = 1 / 60;
        let accumulator = 0;
        let prevTime = now();
        this._scene.registerBeforeRender(() => {
            const currTime = now();
            accumulator += (currTime - prevTime) / 1000;
            if (accumulator > fixedTimeStep) {
                this.onPhysicsUpdate();
                accumulator -= fixedTimeStep;
            }
            prevTime = currTime;
        });
        this._engine.runRenderLoop(() => {
            this._scene.render();
            this._gui.update();
        });
        window.onresize = () => {
            this._engine.resize();
        };
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
        this._gui.datData.add = () => {
            clog('Add', LogLevel.Debug);
            this._gui.datData.remove();
            const { numToAdd } = this._gui.datData;
            this._instancedMeshes = new Array(numToAdd);
            for (let i = 0; i < numToAdd; i++) {
                const instancedMesh = mesh.createInstance('');
                instancedMesh.rotationQuaternion = new BABYLON.Quaternion();
                this._instancedMeshes[i] = instancedMesh;
            }
            // deltaTime + physicsStepComputeTime + (position xyz + rotation xyzw) * numToAdd
            this._dataSAB = new SharedArrayBuffer(NUM_BYTES_FLOAT32 * (2 + 7 * numToAdd));
            this._dataF32SAB = new Float32Array(this._dataSAB);
            this._worker.postMessage(this._dataSAB);
        };
        this._gui.datData.remove = () => {
            clog('Remove', LogLevel.Debug);
            this._instancedMeshes.forEach(instancedMesh => {
                instancedMesh.dispose();
            });
            this._worker.postMessage(0);
        };
        this._gui.datData.numToAdd = 500;
        this._gui.datData.physicsStepComputeTime = 0;
        this._gui.init();
        mesh.setEnabled(false);
    }
    onPhysicsUpdate() {
        // cblog('main: onPhysicsUpdate()', LogLevel.Debug, LogCategory.Main, this._dataF32SAB[2]);
        // const f32Length = this._dataSAB.byteLength / NUM_BYTES_FLOAT32;
        let f32Index = 1;
        let instancedMeshIndex = 0;
        // cblog(`main: onPhysicsUpdate(): _dataF32SAB.length: ${this._dataF32SAB.length}`, LogLevel.Debug, LogCategory.Main);
        while (f32Index < this._dataF32SAB.length - 1) {
            // cblog(`main: onPhysicsUpdate(): instancedMeshIndex: ${instancedMeshIndex}`, LogLevel.Debug, LogCategory.Main);
            const instancedMesh = this._instancedMeshes[instancedMeshIndex];
            instancedMesh?.position.set(this._dataF32SAB[++f32Index], this._dataF32SAB[++f32Index], this._dataF32SAB[++f32Index]);
            instancedMesh?.rotationQuaternion?.set(this._dataF32SAB[++f32Index], this._dataF32SAB[++f32Index], this._dataF32SAB[++f32Index], this._dataF32SAB[++f32Index]);
            // cblog(`main: onPhysicsUpdate(): f32Index: ${f32Index}`, LogLevel.Debug, LogCategory.Main);
            ++instancedMeshIndex;
        }
        // cblog('main: onPhysicsUpdate(): _dataF32SAB[1]', LogLevel.Info, LogCategory.Main, this._dataF32SAB[1]);
        this._gui.updatePhysicsStepComputeTime(this._dataF32SAB[1]);
    }
}
