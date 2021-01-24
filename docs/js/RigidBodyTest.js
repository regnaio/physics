export class RigidBody {
    // private _rigidBody: Ammo.btGhostObject;
    // position and rotation are temporary btVector3 for initial placement
    constructor(_colShape, position, rotation, _options) {
        this._colShape = _colShape;
        this._options = _options;
        this._transform = new Ammo.btTransform();
        this._localInertia = new Ammo.btVector3(0, 0, 0);
        const { mass, friction, restitution, activationState, collisionFlag } = this._options;
        this._transform.setIdentity();
        this._transform.setOrigin(position);
        this._transform.setRotation(rotation);
        this._motionState = new Ammo.btDefaultMotionState(this._transform);
        if (mass !== 0) {
            this._colShape.calculateLocalInertia(mass, this._localInertia);
        }
        this._rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, this._motionState, this._colShape, this._localInertia);
        this._rigidBody = new Ammo.btRigidBody(this._rbInfo);
        if (friction !== undefined) {
            this._rigidBody.setFriction(friction);
        }
        if (restitution !== undefined) {
            this._rigidBody.setRestitution(restitution);
        }
        if (activationState !== undefined) {
            this._rigidBody.setActivationState(activationState);
        }
        if (collisionFlag !== undefined) {
            this._rigidBody.setCollisionFlags(collisionFlag);
        }
    }
    getMotionState() {
        return this._rigidBody.getMotionState();
    }
    getOrigin() {
        return this._rigidBody.getWorldTransform().getOrigin();
    }
    getRotation() {
        return this._rigidBody.getWorldTransform().getRotation();
    }
    getRigidBody() {
        return this._rigidBody;
    }
    add(dynamicsWorld) {
        const { collisionFilterGroup, collisionFilterMask } = this._options;
        if (collisionFilterGroup !== undefined && collisionFilterMask !== undefined) {
            dynamicsWorld.addRigidBody(this._rigidBody, collisionFilterGroup, collisionFilterMask);
            // dynamicsWorld.addCollisionObject(this._rigidBody, collisionFilterGroup, collisionFilterMask);
        }
        else {
            dynamicsWorld.addRigidBody(this._rigidBody);
            // dynamicsWorld.addCollisionObject(this._rigidBody);
        }
        // this._rigidBody.setGravity(new Ammo.btVector3(0, 0, 0));
        // this._rigidBody.setLinearVelocity(new Ammo.btVector3(1e2, 0, 0));
    }
    remove(dynamicsWorld) {
        dynamicsWorld.removeRigidBody(this._rigidBody);
        // dynamicsWorld.removeCollisionObject(this._rigidBody);
    }
    destroy() {
        Ammo.destroy(this._rigidBody);
        Ammo.destroy(this._rbInfo);
        Ammo.destroy(this._motionState);
        Ammo.destroy(this._transform);
        Ammo.destroy(this._localInertia);
    }
}
