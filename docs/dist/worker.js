/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/Physics.js":
/*!***********************!*
  !*** ./js/Physics.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Physics\": () => /* binding */ Physics\n/* harmony export */ });\n/* harmony import */ var _physicsHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./physicsHelper */ \"./js/physicsHelper.js\");\n/* harmony import */ var _RigidBody__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RigidBody */ \"./js/RigidBody.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ \"./js/utils.js\");\n\r\n\r\n\r\nlet tempData;\r\nlet tempResult;\r\nclass Physics {\r\n    // constructor(private _gui: GUI) {\r\n    constructor(wasmPath) {\r\n        this._fixedTimeStep = 1 / 60;\r\n        this._accumulator = 0;\r\n        this._maxSteps = 4; // max physics steps per frame render (WARNING: physics can slow down at low frame rates)\r\n        this._maxSubSteps = 5; // max physics steps per stepSimulation() call\r\n        this._onPhysicsUpdate = (motionStates) => { };\r\n        this._rigidBodies = new Array();\r\n        this._motionStates = new Array();\r\n        this._didAdd = false;\r\n        this.init(wasmPath);\r\n    }\r\n    set onPhysicsUpdate(onPhysicsUpdate) {\r\n        this._onPhysicsUpdate = onPhysicsUpdate;\r\n    }\r\n    async init(wasmPath) {\r\n        try {\r\n            if (typeof Ammo === 'function') {\r\n                if (wasmPath !== undefined) {\r\n                    await Ammo({\r\n                        locateFile: () => wasmPath\r\n                    });\r\n                }\r\n                else {\r\n                    await Ammo();\r\n                }\r\n            }\r\n            tempData = {\r\n                btVector3A: new Ammo.btVector3(0, 0, 0),\r\n                btVector3B: new Ammo.btVector3(0, 0, 0),\r\n                btTransformA: new Ammo.btTransform(),\r\n                btQuaternionA: new Ammo.btQuaternion(0, 0, 0, 1)\r\n            };\r\n            tempResult = {\r\n                concreteContactResultCallback: new Ammo.ConcreteContactResultCallback(),\r\n                concreteContactPosition: new Ammo.btVector3(0, 0, 0),\r\n                concreteContactResult: false,\r\n                closestRayResultCallback: new Ammo.ClosestRayResultCallback(tempData.btVector3A, tempData.btVector3B)\r\n            };\r\n            const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();\r\n            const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);\r\n            const overlappingPairCache = new Ammo.btDbvtBroadphase();\r\n            const solver = new Ammo.btSequentialImpulseConstraintSolver();\r\n            this._dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);\r\n            const { btVector3A } = tempData;\r\n            btVector3A.setValue(0, _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.GRAVITY, 0);\r\n            this._dynamicsWorld.setGravity(btVector3A);\r\n            this.setupCallbacks();\r\n            this.loadEnvironment();\r\n        }\r\n        catch (err) {\r\n            console.log('init(): err', err);\r\n            // clog('init(): err', LogLevel.Fatal, err);\r\n        }\r\n    }\r\n    setupCallbacks() {\r\n        const { concreteContactResultCallback, concreteContactPosition } = tempResult;\r\n        concreteContactResultCallback.addSingleResult = (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) => {\r\n            // @ts-ignore\r\n            const contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);\r\n            const distance = contactPoint.getDistance();\r\n            if (distance > 0) {\r\n                (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`concreteContactResultCallback.addSingleResult(): distance ${distance} > 0`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Warn);\r\n                return 0;\r\n            }\r\n            // @ts-ignore\r\n            const colObj0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper);\r\n            // @ts-ignore\r\n            const rb0 = Ammo.castObject(colObj0.getCollisionObject(), Ammo.btRigidBody);\r\n            // @ts-ignore\r\n            const colObj1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper);\r\n            // @ts-ignore\r\n            const rb1 = Ammo.castObject(colObj1.getCollisionObject(), Ammo.btRigidBody);\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('concreteContactResultCallback.addSingleResult(): colObj0, rb0', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Debug, colObj0, rb0);\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('concreteContactResultCallback.addSingleResult(): colObj1, rb1', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Debug, colObj1, rb1);\r\n            const worldPosition = contactPoint.getPositionWorldOnA();\r\n            concreteContactPosition.setValue(worldPosition.x(), worldPosition.y(), worldPosition.z());\r\n            tempResult.concreteContactResult = true;\r\n            return 0; // unused return value (https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=5982)\r\n        };\r\n    }\r\n    loadEnvironment() {\r\n        if (this._dynamicsWorld === undefined) {\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('loadEnvironment(): _dynamicsWorld === undefined', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Error);\r\n            return;\r\n        }\r\n        // Ground\r\n        const { btVector3A, btQuaternionA } = tempData;\r\n        btVector3A.setValue(25, 0.5, 25);\r\n        const groundShape = new Ammo.btBoxShape(btVector3A);\r\n        btVector3A.setValue(0, -0.5, 0);\r\n        btQuaternionA.setValue(0, 0, 0, 1);\r\n        const ground = new _RigidBody__WEBPACK_IMPORTED_MODULE_1__.RigidBody(groundShape, btVector3A, btQuaternionA, {\r\n            mass: 0,\r\n            friction: 1,\r\n            restitution: 0.5,\r\n            activationState: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.ActivationState.DISABLE_DEACTIVATION,\r\n            collisionFlag: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFlag.CF_STATIC_OBJECT,\r\n            collisionFilterGroup: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterGroup.Environment,\r\n            collisionFilterMask: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterMask.Environment\r\n        });\r\n        ground.add(this._dynamicsWorld);\r\n        // Slide\r\n        btVector3A.setValue(5, 0.5, 10);\r\n        const slideShape = new Ammo.btBoxShape(btVector3A);\r\n        btVector3A.setValue(-10, 0, 0);\r\n        btQuaternionA.setEulerZYX(0, 0, -Math.PI / 6);\r\n        const slide = new _RigidBody__WEBPACK_IMPORTED_MODULE_1__.RigidBody(slideShape, btVector3A, btQuaternionA, {\r\n            mass: 0,\r\n            friction: 1,\r\n            restitution: 0.5,\r\n            activationState: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.ActivationState.DISABLE_DEACTIVATION,\r\n            collisionFlag: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFlag.CF_STATIC_OBJECT,\r\n            collisionFilterGroup: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterGroup.Environment,\r\n            collisionFilterMask: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterMask.Environment\r\n        });\r\n        slide.add(this._dynamicsWorld);\r\n    }\r\n    add(numToAdd) {\r\n        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('add()', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Debug);\r\n        if (this._dynamicsWorld === undefined) {\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('add(): _dynamicsWorld === undefined', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Error);\r\n            return;\r\n        }\r\n        const { btVector3A, btQuaternionA } = tempData;\r\n        btVector3A.setValue(0.25, 0.5, 0.5);\r\n        const colShape = new Ammo.btBoxShape(btVector3A);\r\n        // const { numToAdd } = this._gui.datData;\r\n        this._rigidBodies = new Array(numToAdd);\r\n        this._motionStates = new Array(numToAdd);\r\n        for (let i = 0; i < numToAdd; i++) {\r\n            btVector3A.setValue((0,_utils__WEBPACK_IMPORTED_MODULE_2__.randomRange)(-10, 10), 50, (0,_utils__WEBPACK_IMPORTED_MODULE_2__.randomRange)(-10, 10));\r\n            btQuaternionA.setEulerZYX((0,_utils__WEBPACK_IMPORTED_MODULE_2__.randomRange)(-Math.PI, Math.PI), (0,_utils__WEBPACK_IMPORTED_MODULE_2__.randomRange)(-Math.PI, Math.PI), (0,_utils__WEBPACK_IMPORTED_MODULE_2__.randomRange)(-Math.PI, Math.PI));\r\n            const box = new _RigidBody__WEBPACK_IMPORTED_MODULE_1__.RigidBody(colShape, btVector3A, btQuaternionA, {\r\n                mass: 1,\r\n                friction: 1,\r\n                restitution: 0.5,\r\n                activationState: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.ActivationState.DISABLE_DEACTIVATION,\r\n                collisionFilterGroup: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterGroup.Other,\r\n                collisionFilterMask: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterMask.Other\r\n            });\r\n            box.add(this._dynamicsWorld);\r\n            this._rigidBodies[i] = box;\r\n        }\r\n        this._didAdd = true;\r\n    }\r\n    remove() {\r\n        if (this._dynamicsWorld === undefined) {\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('remove(): _dynamicsWorld === undefined', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Error);\r\n            return;\r\n        }\r\n        for (const rigidBody of this._rigidBodies) {\r\n            rigidBody.remove(this._dynamicsWorld);\r\n            rigidBody.destroy();\r\n        }\r\n        this._rigidBodies = [];\r\n        this._motionStates = [];\r\n        this._didAdd = false;\r\n    }\r\n    // https://gafferongames.com/post/fix_your_timestep/\r\n    onRenderUpdate(deltaTime) {\r\n        if (this._dynamicsWorld === undefined) {\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('onRenderUpdate(): _dynamicsWorld === undefined', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Warn);\r\n            return;\r\n        }\r\n        deltaTime = Math.max(_physicsHelper__WEBPACK_IMPORTED_MODULE_0__.MIN_DELTA_TIME, Math.min(deltaTime, _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.MAX_DELTA_TIME));\r\n        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`onRenderUpdate(): deltaTime: ${deltaTime}`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Debug);\r\n        this._accumulator += deltaTime;\r\n        const { btTransformA } = tempData;\r\n        let stepNum = 0;\r\n        while (this._accumulator >= this._fixedTimeStep && stepNum < this._maxSteps) {\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`stepNum: ${stepNum}`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Debug);\r\n            const beforeStepTime = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();\r\n            this._dynamicsWorld.stepSimulation(this._fixedTimeStep, this._maxSubSteps);\r\n            // clog('onRenderUpdate(): stepSimulation', LogLevel.Debug);\r\n            if (this._didAdd) {\r\n                // const { numToAdd } = this._gui.datData;\r\n                // for (let i = 0; i < numToAdd; i++) {\r\n                for (const [i, rigidBody] of this._rigidBodies.entries()) {\r\n                    // const rigidBody = this._rigidBodies[i];\r\n                    if (rigidBody === undefined) {\r\n                        break;\r\n                    }\r\n                    const motionState = rigidBody.getMotionState();\r\n                    if (motionState) {\r\n                        motionState.getWorldTransform(btTransformA);\r\n                        const p = btTransformA.getOrigin();\r\n                        const q = btTransformA.getRotation();\r\n                        this._motionStates[i] = {\r\n                            position: {\r\n                                x: p.x(),\r\n                                y: p.y(),\r\n                                z: p.z()\r\n                            },\r\n                            rotation: {\r\n                                x: q.x(),\r\n                                y: q.y(),\r\n                                z: q.z(),\r\n                                w: q.w()\r\n                            }\r\n                        };\r\n                    }\r\n                    else {\r\n                        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('onRenderUpdate(): !motionState', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Error);\r\n                    }\r\n                    // const p = this._rigidBodies[i].getOrigin();\r\n                    // const q = this._rigidBodies[i].getRotation();\r\n                    // this._motionStates[i] = {\r\n                    //   position: {\r\n                    //     x: p.x(),\r\n                    //     y: p.y(),\r\n                    //     z: p.z()\r\n                    //   },\r\n                    //   rotation: {\r\n                    //     x: q.x(),\r\n                    //     y: q.y(),\r\n                    //     z: q.z(),\r\n                    //     w: q.w()\r\n                    //   }\r\n                    // };\r\n                }\r\n                this._onPhysicsUpdate([...this._motionStates]);\r\n            }\r\n            // this._gui.updatePhysicsStepComputeTime(now() - beforeStepTime);\r\n            this._accumulator -= this._fixedTimeStep;\r\n            stepNum++;\r\n        }\r\n    }\r\n}\r\n//# sourceMappingURL=Physics.js.map\n\n//# sourceURL=webpack:///./js/Physics.js?");

/***/ }),

/***/ "./js/RigidBody.js":
/*!*************************!*
  !*** ./js/RigidBody.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RigidBody\": () => /* binding */ RigidBody\n/* harmony export */ });\nclass RigidBody {\r\n    // position and rotation are temporary btVector3 for initial placement\r\n    constructor(_colShape, position, rotation, _options) {\r\n        this._colShape = _colShape;\r\n        this._options = _options;\r\n        this._transform = new Ammo.btTransform();\r\n        this._localInertia = new Ammo.btVector3(0, 0, 0);\r\n        const { mass, friction, restitution, activationState, collisionFlag } = this._options;\r\n        this._transform.setIdentity();\r\n        this._transform.setOrigin(position);\r\n        this._transform.setRotation(rotation);\r\n        this._motionState = new Ammo.btDefaultMotionState(this._transform);\r\n        if (mass !== 0) {\r\n            this._colShape.calculateLocalInertia(mass, this._localInertia);\r\n        }\r\n        this._rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, this._motionState, this._colShape, this._localInertia);\r\n        this._rigidBody = new Ammo.btRigidBody(this._rbInfo);\r\n        if (friction !== undefined) {\r\n            this._rigidBody.setFriction(friction);\r\n        }\r\n        if (restitution !== undefined) {\r\n            this._rigidBody.setRestitution(restitution);\r\n        }\r\n        if (activationState !== undefined) {\r\n            this._rigidBody.setActivationState(activationState);\r\n        }\r\n        if (collisionFlag !== undefined) {\r\n            this._rigidBody.setCollisionFlags(collisionFlag);\r\n        }\r\n    }\r\n    getMotionState() {\r\n        return this._rigidBody.getMotionState();\r\n    }\r\n    getOrigin() {\r\n        return this._rigidBody.getWorldTransform().getOrigin();\r\n    }\r\n    getRotation() {\r\n        return this._rigidBody.getWorldTransform().getRotation();\r\n    }\r\n    add(dynamicsWorld) {\r\n        const { collisionFilterGroup, collisionFilterMask } = this._options;\r\n        if (collisionFilterGroup !== undefined && collisionFilterMask !== undefined) {\r\n            dynamicsWorld.addRigidBody(this._rigidBody, collisionFilterGroup, collisionFilterMask);\r\n        }\r\n        else {\r\n            dynamicsWorld.addRigidBody(this._rigidBody);\r\n        }\r\n    }\r\n    remove(dynamicsWorld) {\r\n        dynamicsWorld.removeRigidBody(this._rigidBody);\r\n    }\r\n    destroy() {\r\n        Ammo.destroy(this._rigidBody);\r\n        Ammo.destroy(this._rbInfo);\r\n        Ammo.destroy(this._motionState);\r\n        Ammo.destroy(this._transform);\r\n        Ammo.destroy(this._localInertia);\r\n    }\r\n}\r\n//# sourceMappingURL=RigidBody.js.map\n\n//# sourceURL=webpack:///./js/RigidBody.js?");

/***/ }),

/***/ "./js/physicsHelper.js":
/*!*****************************!*
  !*** ./js/physicsHelper.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GRAVITY\": () => /* binding */ GRAVITY,\n/* harmony export */   \"MIN_DELTA_TIME\": () => /* binding */ MIN_DELTA_TIME,\n/* harmony export */   \"MAX_DELTA_TIME\": () => /* binding */ MAX_DELTA_TIME,\n/* harmony export */   \"ActivationState\": () => /* binding */ ActivationState,\n/* harmony export */   \"CollisionFlag\": () => /* binding */ CollisionFlag,\n/* harmony export */   \"CollisionFilterGroup\": () => /* binding */ CollisionFilterGroup,\n/* harmony export */   \"CollisionFilterMask\": () => /* binding */ CollisionFilterMask\n/* harmony export */ });\nconst GRAVITY = -9.8;\r\nconst MIN_DELTA_TIME = 1 / 1000;\r\nconst MAX_DELTA_TIME = 1;\r\nvar ActivationState;\r\n(function (ActivationState) {\r\n    ActivationState[ActivationState[\"ACTIVE_TAG\"] = 1] = \"ACTIVE_TAG\";\r\n    ActivationState[ActivationState[\"ISLAND_SLEEPING\"] = 2] = \"ISLAND_SLEEPING\";\r\n    ActivationState[ActivationState[\"WANTS_DEACTIVATION\"] = 3] = \"WANTS_DEACTIVATION\";\r\n    ActivationState[ActivationState[\"DISABLE_DEACTIVATION\"] = 4] = \"DISABLE_DEACTIVATION\";\r\n    ActivationState[ActivationState[\"DISABLE_SIMULATION\"] = 5] = \"DISABLE_SIMULATION\";\r\n})(ActivationState || (ActivationState = {}));\r\n// Kinematic if not specified\r\nvar CollisionFlag;\r\n(function (CollisionFlag) {\r\n    CollisionFlag[CollisionFlag[\"CF_STATIC_OBJECT\"] = 1] = \"CF_STATIC_OBJECT\";\r\n    CollisionFlag[CollisionFlag[\"CF_KINEMATIC_OBJECT\"] = 2] = \"CF_KINEMATIC_OBJECT\";\r\n    CollisionFlag[CollisionFlag[\"CF_NO_CONTACT_RESPONSE\"] = 4] = \"CF_NO_CONTACT_RESPONSE\";\r\n    CollisionFlag[CollisionFlag[\"CF_CUSTOM_MATERIAL_CALLBACK\"] = 8] = \"CF_CUSTOM_MATERIAL_CALLBACK\";\r\n    CollisionFlag[CollisionFlag[\"CF_CHARACTER_OBJECT\"] = 16] = \"CF_CHARACTER_OBJECT\";\r\n    CollisionFlag[CollisionFlag[\"CF_DISABLE_VISUALIZE_OBJECT\"] = 32] = \"CF_DISABLE_VISUALIZE_OBJECT\";\r\n    CollisionFlag[CollisionFlag[\"CF_DISABLE_SPU_COLLISION_PROCESSING\"] = 64] = \"CF_DISABLE_SPU_COLLISION_PROCESSING\";\r\n})(CollisionFlag || (CollisionFlag = {}));\r\n// How filters work: https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html\r\n// How to use in Ammo in Babylon: https://github.com/BabylonJS/Babylon.js/pull/8028\r\nvar CollisionFilterGroup;\r\n(function (CollisionFilterGroup) {\r\n    CollisionFilterGroup[CollisionFilterGroup[\"Environment\"] = 1] = \"Environment\";\r\n    CollisionFilterGroup[CollisionFilterGroup[\"Other\"] = 2] = \"Other\";\r\n})(CollisionFilterGroup || (CollisionFilterGroup = {}));\r\nvar CollisionFilterMask;\r\n(function (CollisionFilterMask) {\r\n    CollisionFilterMask[CollisionFilterMask[\"Environment\"] = 2] = \"Environment\";\r\n    CollisionFilterMask[CollisionFilterMask[\"Other\"] = 3] = \"Other\";\r\n})(CollisionFilterMask || (CollisionFilterMask = {}));\r\n//# sourceMappingURL=physicsHelper.js.map\n\n//# sourceURL=webpack:///./js/physicsHelper.js?");

/***/ }),

/***/ "./js/utils.js":
/*!*********************!*
  !*** ./js/utils.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"now\": () => /* binding */ now,\n/* harmony export */   \"LogLevel\": () => /* binding */ LogLevel,\n/* harmony export */   \"clog\": () => /* binding */ clog,\n/* harmony export */   \"LogCategory\": () => /* binding */ LogCategory,\n/* harmony export */   \"cblog\": () => /* binding */ cblog,\n/* harmony export */   \"randomRange\": () => /* binding */ randomRange\n/* harmony export */ });\nfunction now() {\r\n    return window.performance ? performance.now() : Date.now();\r\n}\r\n// https://www.ibm.com/support/knowledgecenter/en/SSEP7J_10.2.2/com.ibm.swg.ba.cognos.ug_rtm_wb.10.2.2.doc/c_n30e74.html\r\nvar LogLevel;\r\n(function (LogLevel) {\r\n    LogLevel[LogLevel[\"None\"] = 0] = \"None\";\r\n    LogLevel[LogLevel[\"Debug\"] = 1] = \"Debug\";\r\n    LogLevel[LogLevel[\"Info\"] = 2] = \"Info\";\r\n    LogLevel[LogLevel[\"Warn\"] = 3] = \"Warn\";\r\n    LogLevel[LogLevel[\"Error\"] = 4] = \"Error\";\r\n    LogLevel[LogLevel[\"Fatal\"] = 5] = \"Fatal\";\r\n    LogLevel[LogLevel[\"All\"] = 6] = \"All\";\r\n})(LogLevel || (LogLevel = {}));\r\nconst colors = ['#ffffff', '#00ff00', '#00ffff', '#ffff00', '#ff00ff', '#ff0000', '#ffffff'];\r\nconst maxLogLevel = LogLevel.Fatal;\r\nconst throwLogLevel = LogLevel.Error;\r\nfunction clog(message, logLevel, ...extra) {\r\n    if (logLevel > maxLogLevel)\r\n        return;\r\n    console.log(`%c ${message}`, `color: ${colors[logLevel]}`, ...extra);\r\n    if (logLevel >= throwLogLevel)\r\n        throw message;\r\n}\r\n;\r\nvar LogCategory;\r\n(function (LogCategory) {\r\n    LogCategory[LogCategory[\"Main\"] = 0] = \"Main\";\r\n    LogCategory[LogCategory[\"Worker\"] = 1] = \"Worker\";\r\n})(LogCategory || (LogCategory = {}));\r\nconst backgroundColors = ['#660000', '#000066'];\r\nfunction cblog(message, logLevel, logCategory, ...extra) {\r\n    if (logLevel > maxLogLevel)\r\n        return;\r\n    console.log(`%c ${message}`, `color: ${colors[logLevel]}; background: ${backgroundColors[logCategory]}`, ...extra);\r\n    if (logLevel >= throwLogLevel)\r\n        throw message;\r\n}\r\n;\r\nfunction randomRange(min, max) {\r\n    return Math.random() * (max - min) + min;\r\n}\r\n//# sourceMappingURL=utils.js.map\n\n//# sourceURL=webpack:///./js/utils.js?");

/***/ }),

/***/ "./js/worker.js":
/*!**********************!*
  !*** ./js/worker.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Physics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Physics */ \"./js/Physics.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./js/utils.js\");\n\r\n\r\nimportScripts('../lib/ammo/ammo.wasm.js');\r\n(0,_utils__WEBPACK_IMPORTED_MODULE_1__.cblog)(`worker self.location`, _utils__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Info, _utils__WEBPACK_IMPORTED_MODULE_1__.LogCategory.Worker, self.location);\r\nconst { origin } = self.location;\r\n(0,_utils__WEBPACK_IMPORTED_MODULE_1__.cblog)(`worker origin: ${origin}`, _utils__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Info, _utils__WEBPACK_IMPORTED_MODULE_1__.LogCategory.Worker);\r\nconst physics = new _Physics__WEBPACK_IMPORTED_MODULE_0__.Physics(`${origin}/lib/ammo/ammo.wasm.wasm`);\r\n(0,_utils__WEBPACK_IMPORTED_MODULE_1__.cblog)('physics', _utils__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Info, _utils__WEBPACK_IMPORTED_MODULE_1__.LogCategory.Worker, physics);\r\nself.onmessage = (ev) => {\r\n    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.cblog)('worker self.onmessage(): ev', _utils__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, _utils__WEBPACK_IMPORTED_MODULE_1__.LogCategory.Worker, ev);\r\n};\r\nself.postMessage('hi');\r\n//# sourceMappingURL=worker.js.map\n\n//# sourceURL=webpack:///./js/worker.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./js/worker.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;