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