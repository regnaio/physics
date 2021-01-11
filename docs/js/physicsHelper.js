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
    CollisionFilterMask[CollisionFilterMask["Other"] = 1] = "Other";
})(CollisionFilterMask || (CollisionFilterMask = {}));
//# sourceMappingURL=physicsHelper.js.map