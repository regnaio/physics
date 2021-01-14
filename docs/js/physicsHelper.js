export var ActivationState;
(function (ActivationState) {
    ActivationState[ActivationState["ACTIVE_TAG"] = 1] = "ACTIVE_TAG";
    ActivationState[ActivationState["ISLAND_SLEEPING"] = 2] = "ISLAND_SLEEPING";
    ActivationState[ActivationState["WANTS_DEACTIVATION"] = 3] = "WANTS_DEACTIVATION";
    ActivationState[ActivationState["DISABLE_DEACTIVATION"] = 4] = "DISABLE_DEACTIVATION";
    ActivationState[ActivationState["DISABLE_SIMULATION"] = 5] = "DISABLE_SIMULATION";
})(ActivationState || (ActivationState = {}));
export var CollisionFlag;
(function (CollisionFlag) {
    CollisionFlag[CollisionFlag["CF_STATIC_OBJECT"] = 1] = "CF_STATIC_OBJECT";
    CollisionFlag[CollisionFlag["CF_KINEMATIC_OBJECT"] = 2] = "CF_KINEMATIC_OBJECT";
    CollisionFlag[CollisionFlag["CF_NO_CONTACT_RESPONSE"] = 4] = "CF_NO_CONTACT_RESPONSE";
    CollisionFlag[CollisionFlag["CF_CUSTOM_MATERIAL_CALLBACK"] = 8] = "CF_CUSTOM_MATERIAL_CALLBACK";
    CollisionFlag[CollisionFlag["CF_CHARACTER_OBJECT"] = 16] = "CF_CHARACTER_OBJECT";
    CollisionFlag[CollisionFlag["CF_DISABLE_VISUALIZE_OBJECT"] = 32] = "CF_DISABLE_VISUALIZE_OBJECT";
    CollisionFlag[CollisionFlag["CF_DISABLE_SPU_COLLISION_PROCESSING"] = 64] = "CF_DISABLE_SPU_COLLISION_PROCESSING";
})(CollisionFlag || (CollisionFlag = {}));
export const GRAVITY = -9.8;
// How filters work: https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html
// How to use in Ammo in Babylon: https://github.com/BabylonJS/Babylon.js/pull/8028
export var CollisionFilterGroup;
(function (CollisionFilterGroup) {
    CollisionFilterGroup[CollisionFilterGroup["Environment"] = 1] = "Environment";
    CollisionFilterGroup[CollisionFilterGroup["Other"] = 2] = "Other";
})(CollisionFilterGroup || (CollisionFilterGroup = {}));
export var CollisionFilterMask;
(function (CollisionFilterMask) {
    CollisionFilterMask[CollisionFilterMask["Environment"] = 2] = "Environment";
    CollisionFilterMask[CollisionFilterMask["Other"] = 3] = "Other";
})(CollisionFilterMask || (CollisionFilterMask = {}));
export const MIN_DELTA_TIME = 1 / 1000;
export const MAX_DELTA_TIME = 1;
//# sourceMappingURL=physicsHelper.js.map