import {
  GRAVITY,
  MIN_DELTA_TIME,
  MAX_DELTA_TIME,
  MAX_STEPS_PER_FRAME,
  MAX_SUBSTEPS_PER_STEP,
  CollisionFilterGroup,
  CollisionFilterMask,
  ActivationState,
  CollisionFlag,
  MotionState
} from './physicsHelper';

import { RigidBody } from './RigidBodyTest';

import { LogLevel, LogCategory, cblog, now, randomRange } from './utils';

interface TempData {
  btVector3A: Ammo.btVector3;
  btVector3B: Ammo.btVector3;
  btTransformA: Ammo.btTransform;
  btQuaternionA: Ammo.btQuaternion;
}

interface TempResult {
  // ContactTest and ContactPairTest
  contactCallback: Ammo.ConcreteContactResultCallback;
  contactWorldPositionA: Ammo.btVector3;
  contactWorldPositionB: Ammo.btVector3;
  contactLocalPositionA: Ammo.btVector3;
  contactLocalPositionB: Ammo.btVector3;
  contactResult: boolean;

  // RayTest
  closestRayResultCallback: Ammo.ClosestRayResultCallback;
}

let tempData: TempData;
let tempResult: TempResult;

let ground: RigidBody;

// class Hi extends Ammo.ContactResultCallback {
//   constructor() {

//   }
// }

export class Physics {
  private _dynamicsWorld?: Ammo.btDiscreteDynamicsWorld;

  private _fixedTimeStep = 1 / 60;
  private _accumulator = 0;

  private _onPhysicsUpdate = (motionStates: Array<MotionState>, physicsStepComputeTime: number) => {};

  private _rigidBodies = new Array<RigidBody>();
  private _motionStates = new Array<MotionState>();

  private _didAdd = false;

  constructor(wasmPath?: string) {
    this.init(wasmPath);
  }

  set onPhysicsUpdate(onPhysicsUpdate: (motionStates: Array<MotionState>, physicsStepComputeTime: number) => void) {
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
        contactCallback: new Ammo.ConcreteContactResultCallback(),
        contactWorldPositionA: new Ammo.btVector3(0, 0, 0),
        contactWorldPositionB: new Ammo.btVector3(0, 0, 0),
        contactLocalPositionA: new Ammo.btVector3(0, 0, 0),
        contactLocalPositionB: new Ammo.btVector3(0, 0, 0),
        contactResult: false,
        closestRayResultCallback: new Ammo.ClosestRayResultCallback(tempData.btVector3A, tempData.btVector3B)
      };

      const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
      const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
      const overlappingPairCache = new Ammo.btDbvtBroadphase();
      const solver = new Ammo.btSequentialImpulseConstraintSolver();
      this._dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(
        dispatcher,
        overlappingPairCache,
        solver,
        collisionConfiguration
      );

      const { btVector3A } = tempData;
      btVector3A.setValue(0, GRAVITY, 0);
      this._dynamicsWorld.setGravity(btVector3A);

      this.setupCallbacks();

      this.loadEnvironment();
    } catch (err) {
      cblog('init(): err', LogLevel.Fatal, LogCategory.Worker, err);
    }
  }

  private setupCallbacks(): void {
    const {
      contactCallback,
      contactWorldPositionA,
      contactWorldPositionB,
      contactLocalPositionA,
      contactLocalPositionB
    } = tempResult;

    // tempResult.contactTestCallback = new Ammo.ConcreteContactResultCallback();
    contactCallback.addSingleResult = (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) => {
      // @ts-ignore
      const contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint) as Ammo.btManifoldPoint;

      const distance = contactPoint.getDistance();
      if (distance > 0) {
        cblog(`contactCallback.addSingleResult(): distance ${distance} > 0`, LogLevel.Warn, LogCategory.Worker);
        contactWorldPositionA.setValue(0, 0, 0);
        contactWorldPositionB.setValue(0, 0, 0);
        contactLocalPositionA.setValue(0, 0, 0);
        contactLocalPositionB.setValue(0, 0, 0);
        tempResult.contactResult = false;
        return 0;
      }

      cblog('contactCallback.addSingleResult(): hit', LogLevel.Debug, LogCategory.Worker);
      // cblog('contactCallback', LogLevel.Debug, LogCategory.Worker, contactCallback);

      // @ts-ignore
      const colObj0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper) as Ammo.btCollisionObjectWrapper;
      // @ts-ignore
      const rb0 = Ammo.castObject(colObj0.getCollisionObject(), Ammo.btRigidBody) as Ammo.btRigidBody;
      // @ts-ignore
      const colObj1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper) as Ammo.btCollisionObjectWrapper;
      // @ts-ignore
      const rb1 = Ammo.castObject(colObj1.getCollisionObject(), Ammo.btRigidBody) as Ammo.btRigidBody;
      // clog('contactCallback.addSingleResult(): colObj0, rb0', LogLevel.Debug, colObj0, rb0);
      // clog('contactCallback.addSingleResult(): colObj1, rb1', LogLevel.Debug, colObj1, rb1);

      const worldPositionA = contactPoint.getPositionWorldOnA();
      contactWorldPositionA.setValue(worldPositionA.x(), worldPositionA.y(), worldPositionA.z());
      const worldPositionB = contactPoint.getPositionWorldOnB();
      contactWorldPositionB.setValue(worldPositionB.x(), worldPositionB.y(), worldPositionB.z());
      const localPositionA = contactPoint.get_m_localPointA();
      contactLocalPositionA.setValue(localPositionA.x(), localPositionA.y(), localPositionA.z());
      const localPositionB = contactPoint.get_m_localPointB();
      contactLocalPositionB.setValue(localPositionB.x(), localPositionB.y(), localPositionB.z());
      tempResult.contactResult = true;
      return 0; // unused return value (https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=5982)
    };
  }

  private loadEnvironment(): void {
    if (this._dynamicsWorld === undefined) {
      cblog('loadEnvironment(): _dynamicsWorld === undefined', LogLevel.Error, LogCategory.Worker);
      return;
    }

    // const { contactTestCallback } = tempResult;

    // Ground
    const { btVector3A, btQuaternionA } = tempData;

    btVector3A.setValue(25, 0.5, 25);
    const groundShape = new Ammo.btBoxShape(btVector3A);

    btVector3A.setValue(0, -0.5, 0);
    btQuaternionA.setValue(0, 0, 0, 1);
    ground = new RigidBody(groundShape, btVector3A, btQuaternionA, {
      mass: 0,
      friction: 1,
      restitution: 0.5,
      activationState: ActivationState.DISABLE_DEACTIVATION,
      collisionFlag: CollisionFlag.CF_STATIC_OBJECT,
      collisionFilterGroup: CollisionFilterGroup.Environment,
      collisionFilterMask: CollisionFilterMask.Environment
    });

    ground.add(this._dynamicsWorld);
    // this._dynamicsWorld.contactTest(ground.getRigidBody(), contactTestCallback);

    // Slide
    btVector3A.setValue(5, 0.5, 10);
    const slideShape = new Ammo.btBoxShape(btVector3A);

    btVector3A.setValue(-10, 0, 0);
    btQuaternionA.setEulerZYX(0, 0, -Math.PI / 6);
    // btQuaternionA.normalize();
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
    // this._dynamicsWorld.contactTest(slide.getRigidBody(), contactTestCallback);
  }

  add(numToAdd: number): void {
    cblog(`add(): numToAdd: ${numToAdd}`, LogLevel.Debug, LogCategory.Worker);
    if (this._dynamicsWorld === undefined) {
      cblog('add(): _dynamicsWorld === undefined', LogLevel.Error, LogCategory.Worker);
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
      btQuaternionA.setEulerZYX(
        randomRange(-Math.PI, Math.PI),
        randomRange(-Math.PI, Math.PI),
        randomRange(-Math.PI, Math.PI)
      );
      const box = new RigidBody(colShape, btVector3A, btQuaternionA, {
        mass: 1,
        friction: 1,
        restitution: 0.5,
        activationState: ActivationState.DISABLE_DEACTIVATION,
        // collisionFlag: CollisionFlag.CF_NO_CONTACT_RESPONSE,
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
      cblog('remove(): _dynamicsWorld === undefined', LogLevel.Error, LogCategory.Worker);
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
      cblog('onRenderUpdate(): _dynamicsWorld === undefined', LogLevel.Warn, LogCategory.Worker);
      return;
    }

    deltaTime = Math.max(MIN_DELTA_TIME, Math.min(deltaTime, MAX_DELTA_TIME));
    // clog(`onRenderUpdate(): deltaTime: ${deltaTime}`, LogLevel.Debug);

    this._accumulator += deltaTime;

    const { btTransformA } = tempData;

    let stepNum = 0;
    while (this._accumulator >= this._fixedTimeStep && stepNum < MAX_STEPS_PER_FRAME) {
      // clog(`stepNum: ${stepNum}`, LogLevel.Debug);
      const beforeStepTime = now();

      this._dynamicsWorld.stepSimulation(this._fixedTimeStep, MAX_SUBSTEPS_PER_STEP);
      // clog('onRenderUpdate(): stepSimulation', LogLevel.Debug);

      // this.detectCollisions();

      const { contactCallback } = tempResult;

      if (this._didAdd) {
        // const { numToAdd } = this._gui.datData;
        // for (let i = 0; i < numToAdd; i++) {
        for (const [i, rigidBody] of this._rigidBodies.entries()) {
          // const rigidBody = this._rigidBodies[i];
          if (rigidBody === undefined) {
            cblog('onRenderUpdate(): rigidBody === undefined', LogLevel.Warn, LogCategory.Worker);
            break;
          }

          this._dynamicsWorld.contactTest(rigidBody.getRigidBody(), contactCallback);
          // @ts-ignore
          // this._dynamicsWorld.contactTest(Ammo.castObject(rigidBody.getRigidBody(), Ammo.btCollisionObject) as Ammo.btCollisionObject, contactTestCallback);
          // this._dynamicsWorld.contactPairTest(rigidBody.getRigidBody(), ground.getRigidBody(), contactTestCallback);

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
            cblog('onRenderUpdate(): !motionState', LogLevel.Error, LogCategory.Worker);
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
      }

      const physicsStepComputeTime = now() - beforeStepTime;
      this._onPhysicsUpdate(this._motionStates, physicsStepComputeTime);

      this._accumulator -= this._fixedTimeStep;
      stepNum++;
    }
  }

  private detectCollisions(): void {
    if (this._dynamicsWorld === undefined) {
      cblog('detectCollision(): _dynamicsWorld === undefined', LogLevel.Warn, LogCategory.Worker);
      return;
    }

    const dispatcher = this._dynamicsWorld.getDispatcher();
    const numManifolds = dispatcher.getNumManifolds();
    for (let i = 0; i < numManifolds; ++i) {
      const contactManifold = dispatcher.getManifoldByIndexInternal(i);

      // @ts-ignore
      const rb0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody) as Ammo.btRigidBody;
      // @ts-ignore
      const rb1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody) as Ammo.btRigidBody;

      const numContacts = contactManifold.getNumContacts();
      for (let j = 0; j < numContacts; ++j) {
        const contactPoint = contactManifold.getContactPoint(j);
        const distance = contactPoint.getDistance();

        if (distance > 0) {
          cblog(`detectCollision(): distance ${distance} > 0`, LogLevel.Warn, LogCategory.Worker);
          return;
        }

        cblog('detectCollision(): hit', LogLevel.Warn, LogCategory.Worker);
        const worldPositionA = contactPoint.get_m_positionWorldOnA();
        const worldPositionB = contactPoint.get_m_positionWorldOnB();
        const localPositionA = contactPoint.get_m_localPointA();
        const localPositionB = contactPoint.get_m_localPointB();
      }
    }
  }

  private raycast(fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number): void {
    if (this._dynamicsWorld === undefined) {
      cblog('raycast(): _dynamicsWorld === undefined', LogLevel.Warn, LogCategory.Worker);
      return;
    }

    const { btVector3A, btVector3B } = tempData;
    const { closestRayResultCallback } = tempResult;

    btVector3A.setValue(fromX, fromY, fromZ);
    btVector3B.setValue(toX, toY, toZ);

    const collisionFilterGroup = closestRayResultCallback.get_m_collisionFilterGroup();
    const collisionFilterMask = closestRayResultCallback.get_m_collisionFilterMask();
    cblog(`raycast(): collisionFilterGroup: ${collisionFilterGroup}, collisionFilterMask: ${collisionFilterMask}`, LogLevel.Warn, LogCategory.Worker);

    this._dynamicsWorld.rayTest(btVector3A, btVector3B, closestRayResultCallback);

    if (closestRayResultCallback.hasHit()) {
      Ammo.btRigidBody.prototype.upcast(closestRayResultCallback.get_m_collisionObject());
      closestRayResultCallback.get_m_hitPointWorld();
    }
  }
}
