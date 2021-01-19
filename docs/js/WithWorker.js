import { GUI } from './GUI';
import { MessageType } from './workerHelper';
import { loadAxes } from './babylonHelper';
import { LogLevel, LogCategory, clog, cblog } from './utils';
export class WithWorker {
    constructor() {
        this._canvas = document.getElementById('renderCanvas');
        this._engine = new BABYLON.Engine(this._canvas);
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 100, new BABYLON.Vector3(), this._scene);
        this._light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);
        this._gui = new GUI();
        this._worker = new Worker('../dist/worker.js');
        this._instancedMeshes = new Array();
        clog('WithWorker', LogLevel.Info);
        this.setupCamera();
        this.setupWorker();
        this.setupGUI();
        this.loadEnvironment();
        loadAxes(this._scene);
        let messageNum = 0;
        this._scene.registerBeforeRender(() => {
            cblog(`messageNum: ${messageNum}`, LogLevel.Debug, LogCategory.Main);
            const message = {
                type: MessageType.Render,
                data: this._engine.getDeltaTime() / 1000
            };
            this._worker.postMessage(JSON.stringify(message));
            messageNum++;
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
    setupWorker() {
        // let messageNum = 0;
        this._worker.onmessage = (ev) => {
            // cblog('main _worker.onmessage(): ev', LogLevel.Debug, LogCategory.Main, ev);
            // cblog(`messageNum: ${messageNum}`, LogLevel.Debug, LogCategory.Main);
            const message = JSON.parse(ev.data);
            switch (message.type) {
                case MessageType.Render:
                    break;
                case MessageType.Step:
                    const { motionStates, physicsStepComputeTime } = message.data;
                    this.onPhysicsUpdate(motionStates, physicsStepComputeTime);
                    break;
                case MessageType.Add:
                    break;
                case MessageType.Remove:
                    break;
            }
            // messageNum++;
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
            for (let i = 0; i < numToAdd; i++) {
                const instancedMesh = mesh.createInstance('');
                instancedMesh.rotationQuaternion = new BABYLON.Quaternion();
                this._instancedMeshes[i] = instancedMesh;
            }
            // this._physics.add(numToAdd);
            const message = {
                type: MessageType.Add,
                data: numToAdd
            };
            this._worker.postMessage(JSON.stringify(message));
        };
        this._gui.datData.remove = () => {
            clog('Remove', LogLevel.Debug);
            this._instancedMeshes.forEach(instancedMesh => {
                instancedMesh.dispose();
            });
            // this._physics.remove();
            const message = {
                type: MessageType.Remove,
                data: undefined
            };
            this._worker.postMessage(JSON.stringify(message));
        };
        this._gui.datData.numToAdd = 500;
        this._gui.datData.physicsStepComputeTime = 0;
        this._gui.init();
        mesh.setEnabled(false);
    }
    onPhysicsUpdate(motionStates, physicsStepComputeTime) {
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
    }
}
