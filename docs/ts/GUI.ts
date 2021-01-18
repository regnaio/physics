interface DatData {
  add: () => void;
  remove: () => void;
  numToAdd: number;
  physicsStepComputeTime: number;
}

export class GUI {
  private _fps = new Stats();
  private _frameRenderDuration = new Stats();
  private _memory = new Stats();

  private _datGUI = new dat.GUI({
    // autoPlace: false,
    hideable: false
    // width: 300
  });

  private _datData: DatData = {
    add: () => {},
    remove: () => {},
    numToAdd: 0,
    physicsStepComputeTime: 0
  };

  private _shouldUpdatePhysicsStepComputeTime = false;

  constructor() {
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

  get datData(): DatData {
    return this._datData;
  }

  init(): void {
    const folder = this._datGUI.addFolder('Folder');
    folder.open();
    folder.add(this._datData, 'add').name('Click to add');
    folder.add(this._datData, 'remove').name('Click to remove all');
    folder.add(this._datData, 'numToAdd', 0, 1000, 100).name('# to add').step(1).listen();
    folder.add(this._datData, 'physicsStepComputeTime').name('Physics').step(1e-2).listen();
  }

  update(): void {
    this._fps.update();
    this._frameRenderDuration.update();
    this._memory.update();
  }

  updatePhysicsStepComputeTime(physicsStepComputeTime: number): void {
    if (this._shouldUpdatePhysicsStepComputeTime) {
      this._datData.physicsStepComputeTime = physicsStepComputeTime;
      this._shouldUpdatePhysicsStepComputeTime = false;
    }
  }
}
