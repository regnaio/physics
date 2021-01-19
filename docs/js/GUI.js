export class GUI {
    constructor() {
        this._fps = new Stats();
        this._frameRenderDuration = new Stats();
        this._memory = new Stats();
        this._datGUI = new dat.GUI({
            // autoPlace: false,
            hideable: false
            // width: 300
        });
        this._datData = {
            add: () => { },
            remove: () => { },
            numToAdd: 0,
            physicsStepComputeTime: 0
        };
        this._shouldUpdatePhysicsStepComputeTime = false;
        document.body.appendChild(this._fps.dom);
        this._fps.dom.style.cssText = 'position:absolute;top:0px;left:0px;z-index:4';
        this._fps.showPanel(0);
        document.body.appendChild(this._frameRenderDuration.dom);
        this._frameRenderDuration.dom.style.cssText = 'position:absolute;top:0px;left:80px;z-index:4';
        this._frameRenderDuration.showPanel(1);
        document.body.appendChild(this._memory.dom);
        this._memory.dom.style.cssText = 'position:absolute;top:0px;left:160px;z-index:4';
        this._memory.showPanel(2);
        this._datGUI.domElement.style.cssText = 'position:absolute;top:0px;right:0px;z-index:4';
        setInterval(() => {
            this._shouldUpdatePhysicsStepComputeTime = true;
        }, 500);
    }
    get datData() {
        return this._datData;
    }
    init() {
        const folder = this._datGUI.addFolder('Folder');
        folder.open();
        folder.add(this._datData, 'add').name('Click to add');
        folder.add(this._datData, 'remove').name('Click to remove all');
        folder.add(this._datData, 'numToAdd', 0, 1000, 100).name('# to add').step(1).listen();
        folder.add(this._datData, 'physicsStepComputeTime').name('Physics').step(1e-2).listen();
    }
    update() {
        this._fps.update();
        this._frameRenderDuration.update();
        this._memory.update();
    }
    updatePhysicsStepComputeTime(physicsStepComputeTime) {
        if (this._shouldUpdatePhysicsStepComputeTime) {
            this._datData.physicsStepComputeTime = physicsStepComputeTime;
            this._shouldUpdatePhysicsStepComputeTime = false;
        }
    }
}
