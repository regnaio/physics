import { CollisionFilterGroup, CollisionFilterMask, ActivationState, CollisionFlag } from './physicsHelper';

export interface RigidBodyOptions {
  mass: number;
  friction?: number;
  restitution?: number;
  activationState?: ActivationState;
  collisionFlag?: CollisionFlag;
  collisionFilterGroup?: CollisionFilterGroup;
  collisionFilterMask?: CollisionFilterMask;
}

export class RigidBody {
  private _transform = new Ammo.btTransform();
  private _localInertia = new Ammo.btVector3(0, 0, 0);
  private _motionState: Ammo.btDefaultMotionState;
  private _rbInfo: Ammo.btRigidBodyConstructionInfo;
  private _rigidBody: Ammo.btRigidBody;

  constructor(private _colShape: Ammo.btCollisionShape, position: Ammo.btVector3, rotation: Ammo.btQuaternion, private _options: RigidBodyOptions) {
    const { mass, friction, restitution, activationState, collisionFlag } = this._options;

    this._transform.setIdentity();
    // position and rotation are temporary btVector3 for initial placement
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

  add(dynamicsWorld: Ammo.btDiscreteDynamicsWorld): void {
    const { collisionFilterGroup, collisionFilterMask } = this._options;

    if (collisionFilterGroup !== undefined && collisionFilterMask !== undefined) {
      dynamicsWorld.addRigidBody(this._rigidBody, collisionFilterGroup, collisionFilterMask);
    } else {
      dynamicsWorld.addRigidBody(this._rigidBody);
    }
  }

  remove(dynamicsWorld: Ammo.btDiscreteDynamicsWorld): void {
    dynamicsWorld.removeRigidBody(this._rigidBody);
  }

  destroy(): void {
    Ammo.destroy(this._rigidBody);
    Ammo.destroy(this._rbInfo);
    Ammo.destroy(this._motionState);
    Ammo.destroy(this._transform);
    Ammo.destroy(this._localInertia);
  }
}
