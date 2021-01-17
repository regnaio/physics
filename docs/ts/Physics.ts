import { GRAVITY, CollisionFilterGroup, CollisionFilterMask, ActivationState, CollisionFlag, MIN_DELTA_TIME, MAX_DELTA_TIME } from './physicsHelper';

import { RigidBody } from './RigidBody';

import { GUI } from './GUI';

import { now, LogLevel, clog, randomRange } from './utils';

interface TempData {
  btVector3A: Ammo.btVector3;
  btVector3B: Ammo.btVector3;
  btTransformA: Ammo.btTransform;
  btQuaternionA: Ammo.btQuaternion;
}

interface TempResult {
  concreteContactResultCallback: Ammo.ConcreteContactResultCallback;
  concreteContactPosition: Ammo.btVector3;
  concreteContactResult: boolean;
  closestRayResultCallback: Ammo.ClosestRayResultCallback;
}

interface MotionState {
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

let tempData: TempData;
let tempResult: TempResult;

export class Physics {
  private _dynamicsWorld?: Ammo.btDiscreteDynamicsWorld;

  private _fixedTimeStep = 1 / 60;
  private _accumulator = 0;
  private _maxSteps = 4; // max physics steps per frame render (WARNING: physics can slow down at low frame rates)
  private _maxSubSteps = 5; // max physics steps per stepSimulation() call

  private _onPhysicsUpdate = (motionStates: Array<MotionState>) => {};

  private _rigidBodies = new Array<RigidBody>();
  private _motionStates = new Array<MotionState>();

  private _didAdd = false;

  // constructor(private _gui: GUI) {
  constructor(wasmPath?: string) {
    this.init(wasmPath);
  }

  set onPhysicsUpdate(onPhysicsUpdate: (motionStates: Array<MotionState>) => void) {
    this._onPhysicsUpdate = onPhysicsUpdate;
  }

  private async init(wasmPath?: string) {
    try {
      if (typeof Ammo === 'function') {
        if (wasmPath !== undefined) {
          await Ammo({
            locateFile: () => wasmPath
          });
        } else {
          await Ammo();
        }
      }

      tempData = {
        btVector3A: new Ammo.btVector3(0, 0, 0),
        btVector3B: new Ammo.btVector3(0, 0, 0),
        btTransformA: new Ammo.btTransform(),
        btQuaternionA: new Ammo.btQuaternion(0, 0, 0, 1)
      };

      tempResult = {
        concreteContactResultCallback: new Ammo.ConcreteContactResultCallback(),
        concreteContactPosition: new Ammo.btVector3(0, 0, 0),
        concreteContactResult: false,
        closestRayResultCallback: new Ammo.ClosestRayResultCallback(tempData.btVector3A, tempData.btVector3B)
      };

      const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
      const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
      const overlappingPairCache = new Ammo.btDbvtBroadphase();
      const solver = new Ammo.btSequentialImpulseConstraintSolver();
      this._dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);

      const { btVector3A } = tempData;
      btVector3A.setValue(0, GRAVITY, 0);
      this._dynamicsWorld.setGravity(btVector3A);

      this.setupCallbacks();

      this.loadEnvironment();
    } catch (err) {
      console.log('init(): err', err);
      // clog('init(): err', LogLevel.Fatal, err);
    }
  }

  private setupCallbacks(): void {
    const { concreteContactResultCallback, concreteContactPosition } = tempResult;

    concreteContactResultCallback.addSingleResult = (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) => {
      // @ts-ignore
      const contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint) as Ammo.btManifoldPoint;

      const distance = contactPoint.getDistance();
      if (distance > 0) {
        clog(`concreteContactResultCallback.addSingleResult(): distance ${distance} > 0`, LogLevel.Warn);
        return 0;
      }

      // @ts-ignore
      const colObj0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper) as Ammo.btCollisionObjectWrapper;
      // @ts-ignore
      const rb0 = Ammo.castObject(colObj0.getCollisionObject(), Ammo.btRigidBody) as Ammo.btRigidBody;

      // @ts-ignore
      const colObj1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper) as Ammo.btCollisionObjectWrapper;
      // @ts-ignore
      const rb1 = Ammo.castObject(colObj1.getCollisionObject(), Ammo.btRigidBody) as Ammo.btRigidBody;

      clog('concreteContactResultCallback.addSingleResult(): colObj0, rb0', LogLevel.Debug, colObj0, rb0);
      clog('concreteContactResultCallback.addSingleResult(): colObj1, rb1', LogLevel.Debug, colObj1, rb1);

      const worldPosition = contactPoint.getPositionWorldOnA();
      concreteContactPosition.setValue(worldPosition.x(), worldPosition.y(), worldPosition.z());

      tempResult.concreteContactResult = true;

      return 0; // unused return value (https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=5982)
    };
  }

  private loadEnvironment(): void {
    if (this._dynamicsWorld === undefined) {
      clog('loadEnvironment(): _dynamicsWorld === undefined', LogLevel.Error);
      return;
    }

    // Ground
    const { btVector3A, btQuaternionA } = tempData;

    btVector3A.setValue(25, 0.5, 25);
    const groundShape = new Ammo.btBoxShape(btVector3A);

    btVector3A.setValue(0, -0.5, 0);
    btQuaternionA.setValue(0, 0, 0, 1);
    const ground = new RigidBody(groundShape, btVector3A, btQuaternionA, {
      mass: 0,
      friction: 1,
      restitution: 0.5,
      activationState: ActivationState.DISABLE_DEACTIVATION,
      collisionFlag: CollisionFlag.CF_STATIC_OBJECT,
      collisionFilterGroup: CollisionFilterGroup.Environment,
      collisionFilterMask: CollisionFilterMask.Environment
    });

    ground.add(this._dynamicsWorld);

    // Slide
    btVector3A.setValue(5, 0.5, 10);
    const slideShape = new Ammo.btBoxShape(btVector3A);

    btVector3A.setValue(-10, 0, 0);
    btQuaternionA.setEulerZYX(0, 0, -Math.PI / 6);
    const slide = new RigidBody(slideShape, btVector3A, btQuaternionA, {
      mass: 0,
      friction: 1,
      restitution: 0.5,
      activationState: ActivationState.DISABLE_DEACTIVATION,
      collisionFlag: CollisionFlag.CF_STATIC_OBJECT,
      collisionFilterGroup: CollisionFilterGroup.Environment,
      collisionFilterMask: CollisionFilterMask.Environment
    });

    slide.add(this._dynamicsWorld);
  }

  add(numToAdd: number): void {
    clog('add()', LogLevel.Debug);
    if (this._dynamicsWorld === undefined) {
      clog('add(): _dynamicsWorld === undefined', LogLevel.Error);
      return;
    }

    const { btVector3A, btQuaternionA } = tempData;

    btVector3A.setValue(0.25, 0.5, 0.5);
    const colShape = new Ammo.btBoxShape(btVector3A);

    // const { numToAdd } = this._gui.datData;
    this._rigidBodies = new Array<RigidBody>(numToAdd);
    this._motionStates = new Array<MotionState>(numToAdd);

    for (let i = 0; i < numToAdd; i++) {
      btVector3A.setValue(randomRange(-10, 10), 50, randomRange(-10, 10));
      btQuaternionA.setEulerZYX(randomRange(-Math.PI, Math.PI), randomRange(-Math.PI, Math.PI), randomRange(-Math.PI, Math.PI));
      const box = new RigidBody(colShape, btVector3A, btQuaternionA, {
        mass: 1,
        friction: 1,
        restitution: 0.5,
        activationState: ActivationState.DISABLE_DEACTIVATION,
        collisionFilterGroup: CollisionFilterGroup.Other,
        collisionFilterMask: CollisionFilterMask.Other
      });

      box.add(this._dynamicsWorld);

      this._rigidBodies[i] = box;
    }

    this._didAdd = true;
  }

  remove(): void {
    if (this._dynamicsWorld === undefined) {
      clog('remove(): _dynamicsWorld === undefined', LogLevel.Error);
      return;
    }

    for (const rigidBody of this._rigidBodies) {
      rigidBody.remove(this._dynamicsWorld);
      rigidBody.destroy();
    }

    this._rigidBodies = [];
    this._motionStates = [];

    this._didAdd = false;
  }

  // https://gafferongames.com/post/fix_your_timestep/
  onRenderUpdate(deltaTime: number) {
    if (this._dynamicsWorld === undefined) {
      clog('onRenderUpdate(): _dynamicsWorld === undefined', LogLevel.Warn);
      return;
    }

    deltaTime = Math.max(MIN_DELTA_TIME, Math.min(deltaTime, MAX_DELTA_TIME));
    clog(`onRenderUpdate(): deltaTime: ${deltaTime}`, LogLevel.Debug);

    this._accumulator += deltaTime;

    const { btTransformA } = tempData;

    let stepNum = 0;
    while (this._accumulator >= this._fixedTimeStep && stepNum < this._maxSteps) {
      clog(`stepNum: ${stepNum}`, LogLevel.Debug);
      const beforeStepTime = now();

      this._dynamicsWorld.stepSimulation(this._fixedTimeStep, this._maxSubSteps);
      // clog('onRenderUpdate(): stepSimulation', LogLevel.Debug);

      if (this._didAdd) {
        // const { numToAdd } = this._gui.datData;
        // for (let i = 0; i < numToAdd; i++) {
        for (const [i, rigidBody] of this._rigidBodies.entries()) {
          // const rigidBody = this._rigidBodies[i];
          if (rigidBody === undefined) {
            break;
          }

          const motionState = rigidBody.getMotionState();
          if (motionState) {
            motionState.getWorldTransform(btTransformA);
            const p = btTransformA.getOrigin();
            const q = btTransformA.getRotation();
            this._motionStates[i] = {
              position: {
                x: p.x(),
                y: p.y(),
                z: p.z()
              },
              rotation: {
                x: q.x(),
                y: q.y(),
                z: q.z(),
                w: q.w()
              }
            };
          } else {
            clog('onRenderUpdate(): !motionState', LogLevel.Error);
          }

          // const p = this._rigidBodies[i].getOrigin();
          // const q = this._rigidBodies[i].getRotation();
          // this._motionStates[i] = {
          //   position: {
          //     x: p.x(),
          //     y: p.y(),
          //     z: p.z()
          //   },
          //   rotation: {
          //     x: q.x(),
          //     y: q.y(),
          //     z: q.z(),
          //     w: q.w()
          //   }
          // };
        }
        this._onPhysicsUpdate([...this._motionStates]);
      }

      // this._gui.updatePhysicsStepComputeTime(now() - beforeStepTime);
      this._accumulator -= this._fixedTimeStep;
      stepNum++;
    }
  }
}
