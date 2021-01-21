export function optimizeScene(scene: BABYLON.Scene): void {
  scene.autoClearDepthAndStencil = false;
  scene.blockMaterialDirtyMechanism = true;

  const options = new BABYLON.SceneOptimizerOptions(60);

  // options.addOptimization(new BABYLON.MergeMeshesOptimization(0));
  options.addOptimization(new BABYLON.ShadowsOptimization(0));
  options.addOptimization(new BABYLON.LensFlaresOptimization(0));
  options.addOptimization(new BABYLON.PostProcessesOptimization(1));
  options.addOptimization(new BABYLON.ParticlesOptimization(1));
  options.addOptimization(new BABYLON.TextureOptimization(2, 256));
  options.addOptimization(new BABYLON.RenderTargetsOptimization(3));

  // options.addOptimization(new BABYLON.HardwareScalingOptimization(4, 2));
  // TODO: Custom optimizations, e.g. disable or reduce projectile collision calculations
  // options.addCustomOptimization(scene => {
  //   return true;
  // }, () => {
  //   return 'custom optimization';
  // }, 4);

  const optimizer = new BABYLON.SceneOptimizer(scene, options, true, false);
  optimizer.start();
}

export function setupCamera(camera: BABYLON.ArcRotateCamera, canvas: HTMLCanvasElement): void {
  camera.keysUp = [];
  camera.keysLeft = [];
  camera.keysDown = [];
  camera.keysRight = [];
  camera.attachControl(canvas, false);
  camera.setTarget(new BABYLON.Vector3(0, 10, 0));
}

export function loadAxes(scene: BABYLON.Scene): void {
  const size = 100;

  const axisX = BABYLON.Mesh.CreateLines(
    'axisX',
    [
      new BABYLON.Vector3(),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ],
    scene
  );
  axisX.isPickable = false;
  axisX.color = new BABYLON.Color3(1, 0, 0);

  const axisY = BABYLON.Mesh.CreateLines(
    'axisY',
    [
      new BABYLON.Vector3(),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ],
    scene
  );
  axisY.isPickable = false;
  axisY.color = new BABYLON.Color3(0, 1, 0);

  const axisZ = BABYLON.Mesh.CreateLines(
    'axisZ',
    [
      new BABYLON.Vector3(),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ],
    scene
  );
  axisZ.isPickable = false;
  axisZ.color = new BABYLON.Color3(0, 0, 1);
}
