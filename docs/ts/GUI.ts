import { LogLevel, clog } from './utils';

interface DatData {
  add: () => void;
  remove: () => void;
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
    physicsStepComputeTime: 0
  };

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
  }

  set datData(datData: DatData) {
    this._datData = datData;

    const localPlayerFolder = this._datGUI.addFolder('LocalPlayer');
    localPlayerFolder.open();
    localPlayerFolder.add(this._datData, 'add').name('Click to add');
    localPlayerFolder.add(this._datData, 'remove').name('Click to remove all');
    localPlayerFolder.add(this._datData, 'physicsStepComputeTime').name('Physics').step(1e-2).listen();
  }

  update(): void {
    this._fps.update();
    this._frameRenderDuration.update();
    this._memory.update();
  }

  updatePhysicsStepComputeTime(physicsStepComputeTime: number): void {
    this._datData.physicsStepComputeTime = physicsStepComputeTime;
  }
}
