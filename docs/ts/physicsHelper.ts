export const GRAVITY = -9.8;

// How filters work: https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html
// How to use in Ammo in Babylon: https://github.com/BabylonJS/Babylon.js/pull/8028

export enum CollisionFilterGroup {
  Environment = 1,
  Other
}

export enum CollisionFilterMask {
  Environment = CollisionFilterGroup.Other,
  Other = CollisionFilterGroup.Environment
}
