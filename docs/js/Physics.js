import { GRAVITY } from './physicsHelper';
import { LogLevel, clog } from './utils';
let tempData;
let tempResult;
export class Physics {
    constructor() {
        this._fixedTimeStep = 1 / 60;
        this._maxSubSteps = 4;
        this._accumulator = 0;
        this._onPhysicsUpdate = () => { };
        this.init();
    }
    set onPhysicsUpdate(onPhysicsUpdate) {
        this._onPhysicsUpdate = onPhysicsUpdate;
    }
    async init() {
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
                const contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);
                const distance = contactPoint.getDistance();
                if (distance > 0) {
                    clog(`concreteContactResultCallback.addSingleResult(): distance ${distance} > 0`, LogLevel.Warn);
                    return 0;
                }
                // @ts-ignore
                const colObj0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper);
                // @ts-ignore
                const rb0 = Ammo.castObject(colObj0.getCollisionObject(), Ammo.btRigidBody);
                // @ts-ignore
                const colObj1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper);
                // @ts-ignore
                const rb1 = Ammo.castObject(colObj1.getCollisionObject(), Ammo.btRigidBody);
                clog('concreteContactResultCallback.addSingleResult(): colObj0, rb0', LogLevel.Debug, colObj0, rb0);
                clog('concreteContactResultCallback.addSingleResult(): colObj1, rb1', LogLevel.Debug, colObj1, rb1);
                const worldPosition = contactPoint.getPositionWorldOnA();
                concreteContactPosition.setValue(worldPosition.x(), worldPosition.y(), worldPosition.z());
                tempResult.concreteContactResult = true;
                return 0; // unused return (https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=5982)
            };
            // dynamicsWorld.stepSimulation();
        }
        catch (err) {
            clog('init(): err', LogLevel.Fatal, err);
        }
    }
    onRenderUpdate(deltaTime) {
        clog(`onRenderUpdate(): deltaTime: ${deltaTime}`, LogLevel.Debug);
        if (this._dynamicsWorld === undefined) {
            clog('onRenderUpdate(): _dynamicsWorld === undefined', LogLevel.Warn);
            return;
        }
        this._accumulator += deltaTime;
        while (this._accumulator >= this._fixedTimeStep) {
            this._dynamicsWorld.stepSimulation(this._fixedTimeStep, this._maxSubSteps);
            clog('step', LogLevel.Debug);
            this._accumulator -= this._fixedTimeStep;
        }
    }
}
//# sourceMappingURL=Physics.js.map