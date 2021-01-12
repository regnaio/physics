import { GRAVITY, CollisionFilterGroup, CollisionFilterMask } from './physicsHelper';

import { now, LogLevel, clog } from './utils';

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

let tempData: TempData;
let tempResult: TempResult;

export class Physics {
  private _dynamicsWorld?: Ammo.btDiscreteDynamicsWorld;

  private _fixedTimeStep = 1 / 60;
  private _maxSubSteps = 4;
  private _accumulator = 0;

  private _onPhysicsUpdate = () => {};

  constructor() {
    this.init();
  }

  set onPhysicsUpdate(onPhysicsUpdate: () => void) {
    this._onPhysicsUpdate = onPhysicsUpdate;
  }

  private async init() {
    try {
      if (typeof Ammo === 'function') {
        await Ammo();
      }

      tempData = {
        btVector3A: new Ammo.btVector3(0, 0, 0),
        btVector3B: new Ammo.btVector3(0, 0, 0),
        btTransformA: new Ammo.btTransform(),
        btQuaternionA: new Ammo.btQuaternion(0, 0, 0, 1)
      };
      // tempData.btTransformA.setIdentity();

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
      const { concreteContactResultCallback, concreteContactPosition } = tempResult;

      this._dynamicsWorld.setGravity(new Ammo.btVector3(0, GRAVITY, 0));

      const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(50, 0.5, 50));

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

        return 0; // unused return (https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=5982)
      };

      // dynamicsWorld.stepSimulation();
    } catch (err) {
      clog('init(): err', LogLevel.Fatal, err);
    }
  }

  onRenderUpdate(deltaTime: number) {
    // clog(`onRenderUpdate(): deltaTime: ${deltaTime}`, LogLevel.Debug);
    if (this._dynamicsWorld === undefined) {
      clog('onRenderUpdate(): _dynamicsWorld === undefined', LogLevel.Warn);
      return;
    }

    this._accumulator += deltaTime;

    while (this._accumulator >= this._fixedTimeStep) {
      this._dynamicsWorld.stepSimulation(this._fixedTimeStep, this._maxSubSteps);
      // clog('onRenderUpdate(): stepSimulation', LogLevel.Debug);

      this._onPhysicsUpdate();

      this._accumulator -= this._fixedTimeStep;
    }
  }
}
