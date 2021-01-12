import { GRAVITY, CollisionFilterGroup, CollisionFilterMask, ActivationState, CollisionFlag } from './physicsHelper';

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

let tempData: TempData;
let tempResult: TempResult;

export class Physics {
  private _dynamicsWorld?: Ammo.btDiscreteDynamicsWorld;

  private _fixedTimeStep = 1 / 60;
  private _maxSubSteps = 4;
  private _accumulator = 0;

  private _onPhysicsUpdate = () => {};

  private _bodies = new Array<Ammo.btRigidBody>(500);

  constructor(private _gui: GUI) {
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

      this.loadEnvironment();
    } catch (err) {
      clog('init(): err', LogLevel.Fatal, err);
    }
  }

  private loadEnvironment(): void {
    if (this._dynamicsWorld === undefined) {
      clog('loadEnvironment(): _dynamicsWorld === undefined', LogLevel.Error);
      return;
    }

    const mass = 0;

    // ground
    const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(25, 0.5, 25));

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(0, -0.5, 0));
    transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    // groundShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, groundShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);

    body.setActivationState(ActivationState.DISABLE_DEACTIVATION);
    body.setCollisionFlags(CollisionFlag.CF_STATIC_OBJECT);

    this._dynamicsWorld.addRigidBody(body, CollisionFilterGroup.Environment, CollisionFilterMask.Environment);

    // slide
    const slideShape = new Ammo.btBoxShape(new Ammo.btVector3(25, 0.5, 25));

    transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(0, 0, 0));
    const rotation = new Ammo.btQuaternion(0, 0, 0, 1);
    rotation.setEulerZYX(0, 0, -Math.PI / 6);
    transform.setRotation(rotation);
    motionState = new Ammo.btDefaultMotionState(transform);

    localInertia = new Ammo.btVector3(0, 0, 0);
    // slideShape.calculateLocalInertia(mass, localInertia);

    rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, slideShape, localInertia);
    body = new Ammo.btRigidBody(rbInfo);

    body.setActivationState(ActivationState.DISABLE_DEACTIVATION);
    body.setCollisionFlags(CollisionFlag.CF_STATIC_OBJECT);

    this._dynamicsWorld.addRigidBody(body, CollisionFilterGroup.Environment, CollisionFilterMask.Environment);
  }

  add(): void {
    if (this._dynamicsWorld === undefined) {
      clog('add(): _dynamicsWorld === undefined', LogLevel.Error);
      return;
    }

    const mass = 1;

    const colShape = new Ammo.btBoxShape(new Ammo.btVector3(0.25, 0.5, 0.5));

    for (let i = 0; i < 1; i++) {
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(randomRange(-10, 10), 50, randomRange(-10, 10)));
      const rotation = new Ammo.btQuaternion(0, 0, 0, 1);
      rotation.setEulerZYX(randomRange(-Math.PI, Math.PI), randomRange(-Math.PI, Math.PI), randomRange(-Math.PI, Math.PI));
      transform.setRotation(rotation);
      let motionState = new Ammo.btDefaultMotionState(transform);

      const localInertia = new Ammo.btVector3(0, 0, 0);
      colShape.calculateLocalInertia(mass, localInertia);

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);

      body.setActivationState(ActivationState.DISABLE_DEACTIVATION);

      this._dynamicsWorld.addRigidBody(body, CollisionFilterGroup.Other, CollisionFilterMask.Other);
      this._bodies.push(body);
    }
  }

  // https://gafferongames.com/post/fix_your_timestep/
  onRenderUpdate(deltaTime: number) {
    // clog(`onRenderUpdate(): deltaTime: ${deltaTime}`, LogLevel.Debug);
    if (this._dynamicsWorld === undefined) {
      clog('onRenderUpdate(): _dynamicsWorld === undefined', LogLevel.Warn);
      return;
    }

    this._accumulator += deltaTime;

    while (this._accumulator >= this._fixedTimeStep) {
      const beforeStepTime = now();

      this._dynamicsWorld.stepSimulation(this._fixedTimeStep, this._maxSubSteps);
      // clog('onRenderUpdate(): stepSimulation', LogLevel.Debug);

      this._onPhysicsUpdate();

      this._accumulator -= this._fixedTimeStep;
      this._gui.updatePhysicsStepComputeTime(now() - beforeStepTime);
    }
  }
}
