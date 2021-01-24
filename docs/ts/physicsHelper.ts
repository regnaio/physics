export const GRAVITY = -9.8;

// export const MIN_DELTA_TIME = 1 / 1000; // sec, WARNING: physics can speed up at high frame rates (frame duration < 1 ms)
export const MIN_DELTA_TIME = 0; // sec, prevents physics from speeding up
export const MAX_DELTA_TIME = 1; // sec

export const MAX_STEPS_PER_FRAME = 4; // WARNING: physics can slow down at low frame rates (frame duration > 4 / 60 sec)
export const MAX_SUBSTEPS_PER_STEP = 0; // only 1 step per stepSimulation() call

export enum ActivationState {
  ACTIVE_TAG = 1,
  ISLAND_SLEEPING,
  WANTS_DEACTIVATION,
  DISABLE_DEACTIVATION,
  DISABLE_SIMULATION
}

// Dynamic if not specified
export enum CollisionFlag {
  CF_STATIC_OBJECT = 1,
  CF_KINEMATIC_OBJECT = 2,
  CF_NO_CONTACT_RESPONSE = 4,
  CF_CUSTOM_MATERIAL_CALLBACK = 8,
  CF_CHARACTER_OBJECT = 16,
  CF_DISABLE_VISUALIZE_OBJECT = 32,
  CF_DISABLE_SPU_COLLISION_PROCESSING = 64
}

// How filters work: https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html
// How to use in Ammo in Babylon: https://github.com/BabylonJS/Babylon.js/pull/8028
export enum CollisionFilterGroup {
  Environment = 1,
  Other = 2
}

export enum CollisionFilterMask {
  Environment = CollisionFilterGroup.Other,
  // Other = CollisionFilterGroup.Environment | CollisionFilterGroup.Other
  Other = CollisionFilterGroup.Environment
  // Other = 0
}

export interface MotionState {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
}