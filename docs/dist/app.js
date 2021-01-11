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

/***/ "./js/GUI.js":
/*!*******************!*
  !*** ./js/GUI.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GUI\": () => /* binding */ GUI\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./js/utils.js\");\n\r\nclass GUI {\r\n    constructor() {\r\n        this._fps = new Stats();\r\n        this._frameRenderDuration = new Stats();\r\n        this._memory = new Stats();\r\n        this._datGUI = new dat.GUI({\r\n            // autoPlace: false,\r\n            hideable: false\r\n            // width: 300\r\n        });\r\n        this._datData = {\r\n            add: () => { },\r\n            remove: () => { },\r\n            physicsStepComputeTime: 0\r\n        };\r\n        document.body.appendChild(this._fps.dom);\r\n        this._fps.dom.style.cssText = 'position:absolute;top:0px;left:0px;z-index:4';\r\n        this._fps.showPanel(0);\r\n        document.body.appendChild(this._frameRenderDuration.dom);\r\n        this._frameRenderDuration.dom.style.cssText = 'position:absolute;top:0px;left:80px;z-index:4';\r\n        this._frameRenderDuration.showPanel(1);\r\n        document.body.appendChild(this._memory.dom);\r\n        this._memory.dom.style.cssText = 'position:absolute;top:0px;left:160px;z-index:4';\r\n        this._memory.showPanel(2);\r\n        this._datGUI.domElement.style.cssText = 'position:absolute;top:0px;right:0px;z-index:4';\r\n    }\r\n    set datData(datData) {\r\n        this._datData = datData;\r\n        const localPlayerFolder = this._datGUI.addFolder('LocalPlayer');\r\n        localPlayerFolder.open();\r\n        localPlayerFolder.add(this._datData, 'add').name('Click to add');\r\n        localPlayerFolder.add(this._datData, 'remove').name('Click to remove all');\r\n        localPlayerFolder.add(this._datData, 'physicsStepComputeTime').name('Physics').step(1e-2).listen();\r\n    }\r\n    update() {\r\n        this._fps.update();\r\n        this._frameRenderDuration.update();\r\n        this._memory.update();\r\n    }\r\n    updatePhysicsStepComputeTime(physicsStepComputeTime) {\r\n        this._datData.physicsStepComputeTime = physicsStepComputeTime;\r\n    }\r\n}\r\n//# sourceMappingURL=GUI.js.map\n\n//# sourceURL=webpack:///./js/GUI.js?");

/***/ }),

/***/ "./js/NoWorker.js":
/*!************************!*
  !*** ./js/NoWorker.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"NoWorker\": () => /* binding */ NoWorker\n/* harmony export */ });\n/* harmony import */ var _physicsHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./physicsHelper */ \"./js/physicsHelper.js\");\n/* harmony import */ var _GUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GUI */ \"./js/GUI.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ \"./js/utils.js\");\n\r\n\r\n\r\nclass NoWorker {\r\n    constructor() {\r\n        this._canvas = document.getElementById('renderCanvas');\r\n        this._engine = new BABYLON.Engine(this._canvas, true, {\r\n            deterministicLockstep: true,\r\n            lockstepMaxSteps: 4\r\n        });\r\n        this._scene = new BABYLON.Scene(this._engine);\r\n        this._camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 4, 150, new BABYLON.Vector3(), this._scene);\r\n        this._light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);\r\n        this._gui = new _GUI__WEBPACK_IMPORTED_MODULE_1__.GUI();\r\n        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('NoWorker', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Info);\r\n        this.setupCamera();\r\n        this.setupPhysics();\r\n        this._engine.runRenderLoop(() => {\r\n            this._scene.render();\r\n            this._gui.update();\r\n        });\r\n        window.onresize = () => {\r\n            this._engine.resize();\r\n        };\r\n    }\r\n    setupCamera() {\r\n        this._camera.attachControl(this._canvas, false);\r\n        this._camera.setTarget(new BABYLON.Vector3(0, 10, 0));\r\n    }\r\n    async setupPhysics() {\r\n        var _a, _b;\r\n        try {\r\n            if (typeof Ammo === 'function') {\r\n                await Ammo();\r\n            }\r\n            const physEngine = new BABYLON.AmmoJSPlugin(false);\r\n            this._scene.enablePhysics(new BABYLON.Vector3(0, _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.GRAVITY, 0), physEngine);\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`_engine.isDeterministicLockStep(): ${this._engine.isDeterministicLockStep()}`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Info);\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`_engine.getLockstepMaxSteps(): ${this._engine.getLockstepMaxSteps()}`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Info);\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`_engine.getTimeStep(): ${this._engine.getTimeStep()}`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Info);\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`physEngine.getTimeStep(): ${physEngine.getTimeStep()}`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Info);\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`_scene.getPhysicsEngine()?.getTimeStep(): ${(_a = this._scene.getPhysicsEngine()) === null || _a === void 0 ? void 0 : _a.getTimeStep()}`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Info);\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`_scene.getPhysicsEngine()?.getSubTimeStep(): ${(_b = this._scene.getPhysicsEngine()) === null || _b === void 0 ? void 0 : _b.getSubTimeStep()}`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Info);\r\n            this.loadEnvironment();\r\n            const mesh = BABYLON.MeshBuilder.CreateBox('', { width: 0.5 }, this._scene);\r\n            const material = new BABYLON.StandardMaterial('', this._scene);\r\n            material.diffuseColor = new BABYLON.Color3(1, 1, 0);\r\n            mesh.material = material;\r\n            const instancedMeshes = new Array(500);\r\n            this._gui.datData = {\r\n                add: () => {\r\n                    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('Add', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Debug);\r\n                    for (let i = 0; i < 500; i++) {\r\n                        const instancedMesh = mesh.createInstance('');\r\n                        instancedMesh.position = new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-50, 50), 50, BABYLON.Scalar.RandomRange(-50, 50));\r\n                        instancedMesh.rotationQuaternion = new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-Math.PI, Math.PI), BABYLON.Scalar.RandomRange(-Math.PI, Math.PI), BABYLON.Scalar.RandomRange(-Math.PI, Math.PI)).toQuaternion();\r\n                        instancedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(instancedMesh, BABYLON.PhysicsImpostor.BoxImpostor, {\r\n                            mass: 1,\r\n                            friction: 1,\r\n                            // @ts-ignore\r\n                            group: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterGroup.Other,\r\n                            mask: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterMask.Other\r\n                        }, this._scene);\r\n                        instancedMeshes.push(instancedMesh);\r\n                    }\r\n                },\r\n                remove: () => {\r\n                    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('Remove', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Debug);\r\n                    instancedMeshes.forEach(instancedMesh => {\r\n                        var _a;\r\n                        (_a = instancedMesh.physicsImpostor) === null || _a === void 0 ? void 0 : _a.dispose();\r\n                        instancedMesh.dispose();\r\n                    });\r\n                },\r\n                physicsStepComputeTime: 0\r\n            };\r\n            mesh.setEnabled(false);\r\n            let shouldUpdate = false;\r\n            setInterval(() => {\r\n                shouldUpdate = true;\r\n            }, 100);\r\n            let beforeStepTime = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();\r\n            this._scene.onBeforeStepObservable.add(() => {\r\n                const current = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();\r\n                const betweenStepsDuration = current - beforeStepTime;\r\n                beforeStepTime = current;\r\n            });\r\n            this._scene.onAfterStepObservable.add(() => {\r\n                const current = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();\r\n                const stepDuration = current - beforeStepTime;\r\n                if (shouldUpdate) {\r\n                    this._gui.updatePhysicsStepComputeTime(stepDuration);\r\n                    shouldUpdate = false;\r\n                }\r\n            });\r\n        }\r\n        catch (err) {\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('setupPhysics(): err', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Fatal, err);\r\n        }\r\n    }\r\n    loadEnvironment() {\r\n        const wall = BABYLON.MeshBuilder.CreateBox('', { width: 4, height: 2 }, this._scene);\r\n        const wallMaterial = new BABYLON.StandardMaterial('', this._scene);\r\n        wallMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);\r\n        // wallMaterial.alpha = 0.5;\r\n        wallMaterial.freeze();\r\n        wall.material = wallMaterial;\r\n        wall.position.x -= 3;\r\n        wall.position.y += 1;\r\n        wall.freezeWorldMatrix();\r\n        wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, {\r\n            mass: 0,\r\n            friction: 1,\r\n            // @ts-ignore\r\n            group: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterGroup.Environment,\r\n            mask: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterMask.Environment\r\n        }, this._scene);\r\n        // wall.physicsImpostor.sleep();\r\n        const slide = BABYLON.MeshBuilder.CreateBox('', { width: 3, height: 20 }, this._scene);\r\n        const slideMaterial = new BABYLON.StandardMaterial('', this._scene);\r\n        slideMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);\r\n        // slideMaterial.alpha = 0.5;\r\n        slideMaterial.freeze();\r\n        slide.material = slideMaterial;\r\n        slide.position.x += 2.5;\r\n        slide.rotationQuaternion = new BABYLON.Vector3(Math.PI / 3, 0, 0).toQuaternion();\r\n        slide.freezeWorldMatrix();\r\n        slide.physicsImpostor = new BABYLON.PhysicsImpostor(slide, BABYLON.PhysicsImpostor.BoxImpostor, {\r\n            mass: 0,\r\n            friction: 1,\r\n            // @ts-ignore\r\n            group: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterGroup.Environment,\r\n            mask: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterMask.Environment\r\n        }, this._scene);\r\n        // slide.physicsImpostor.sleep();\r\n        const ground = BABYLON.MeshBuilder.CreateBox('', { width: 100, height: 1, depth: 100 }, this._scene);\r\n        const groundMaterial = new BABYLON.StandardMaterial('', this._scene);\r\n        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);\r\n        // groundMaterial.alpha = 0.5;\r\n        groundMaterial.freeze();\r\n        ground.material = groundMaterial;\r\n        ground.position.y -= 0.5;\r\n        ground.freezeWorldMatrix();\r\n        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {\r\n            mass: 0,\r\n            friction: 1,\r\n            // @ts-ignore\r\n            group: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterGroup.Environment,\r\n            mask: _physicsHelper__WEBPACK_IMPORTED_MODULE_0__.CollisionFilterMask.Environment\r\n        }, this._scene);\r\n        // ground.physicsImpostor.sleep();\r\n    }\r\n}\r\n//# sourceMappingURL=NoWorker.js.map\n\n//# sourceURL=webpack:///./js/NoWorker.js?");

/***/ }),

/***/ "./js/WithWorker.js":
/*!**************************!*
  !*** ./js/WithWorker.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"WithWorker\": () => /* binding */ WithWorker\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./js/utils.js\");\n\r\nclass WithWorker {\r\n    constructor() {\r\n        this._canvas = document.getElementById('renderCanvas');\r\n        this._engine = new BABYLON.Engine(this._canvas);\r\n        this._scene = new BABYLON.Scene(this._engine);\r\n        this._camera = new BABYLON.ArcRotateCamera('', 0, Math.PI / 2, 5, new BABYLON.Vector3(), this._scene);\r\n        this._light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 100, 0), this._scene);\r\n        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clog)('WithWorker', _utils__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Info);\r\n        this._engine.runRenderLoop(() => {\r\n            this._scene.render();\r\n        });\r\n        window.onresize = () => {\r\n            this._engine.resize();\r\n        };\r\n    }\r\n}\r\n//# sourceMappingURL=WithWorker.js.map\n\n//# sourceURL=webpack:///./js/WithWorker.js?");

/***/ }),

/***/ "./js/app.js":
/*!*******************!*
  !*** ./js/app.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _NoWorker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NoWorker */ \"./js/NoWorker.js\");\n/* harmony import */ var _WithWorker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WithWorker */ \"./js/WithWorker.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ \"./js/utils.js\");\n\r\n\r\n\r\nconst { pathname } = window.location;\r\nconst parts = pathname.split('/');\r\nconst route = parts.pop() || parts.pop();\r\n(0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)('route', _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Info, route);\r\nswitch (pathname) {\r\n    case '/noworker/':\r\n        new _NoWorker__WEBPACK_IMPORTED_MODULE_0__.NoWorker();\r\n        break;\r\n    case '/withworker/':\r\n        new _WithWorker__WEBPACK_IMPORTED_MODULE_1__.WithWorker();\r\n        break;\r\n    default:\r\n        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.clog)(`Invalid pathname ${pathname}`, _utils__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Error);\r\n}\r\n//# sourceMappingURL=app.js.map\n\n//# sourceURL=webpack:///./js/app.js?");

/***/ }),

/***/ "./js/physicsHelper.js":
/*!*****************************!*
  !*** ./js/physicsHelper.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GRAVITY\": () => /* binding */ GRAVITY,\n/* harmony export */   \"CollisionFilterGroup\": () => /* binding */ CollisionFilterGroup,\n/* harmony export */   \"CollisionFilterMask\": () => /* binding */ CollisionFilterMask\n/* harmony export */ });\nconst GRAVITY = -9.8;\r\n// How filters work: https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html\r\n// How to use in Ammo in Babylon: https://github.com/BabylonJS/Babylon.js/pull/8028\r\nvar CollisionFilterGroup;\r\n(function (CollisionFilterGroup) {\r\n    CollisionFilterGroup[CollisionFilterGroup[\"Environment\"] = 1] = \"Environment\";\r\n    CollisionFilterGroup[CollisionFilterGroup[\"Other\"] = 2] = \"Other\";\r\n})(CollisionFilterGroup || (CollisionFilterGroup = {}));\r\nvar CollisionFilterMask;\r\n(function (CollisionFilterMask) {\r\n    CollisionFilterMask[CollisionFilterMask[\"Environment\"] = 2] = \"Environment\";\r\n    CollisionFilterMask[CollisionFilterMask[\"Other\"] = 1] = \"Other\";\r\n})(CollisionFilterMask || (CollisionFilterMask = {}));\r\n//# sourceMappingURL=physicsHelper.js.map\n\n//# sourceURL=webpack:///./js/physicsHelper.js?");

/***/ }),

/***/ "./js/utils.js":
/*!*********************!*
  !*** ./js/utils.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"now\": () => /* binding */ now,\n/* harmony export */   \"LogLevel\": () => /* binding */ LogLevel,\n/* harmony export */   \"clog\": () => /* binding */ clog\n/* harmony export */ });\nfunction now() {\r\n    return window.performance ? performance.now() : Date.now();\r\n}\r\n// https://www.ibm.com/support/knowledgecenter/en/SSEP7J_10.2.2/com.ibm.swg.ba.cognos.ug_rtm_wb.10.2.2.doc/c_n30e74.html\r\nvar LogLevel;\r\n(function (LogLevel) {\r\n    LogLevel[LogLevel[\"None\"] = 0] = \"None\";\r\n    LogLevel[LogLevel[\"Debug\"] = 1] = \"Debug\";\r\n    LogLevel[LogLevel[\"Info\"] = 2] = \"Info\";\r\n    LogLevel[LogLevel[\"Warn\"] = 3] = \"Warn\";\r\n    LogLevel[LogLevel[\"Error\"] = 4] = \"Error\";\r\n    LogLevel[LogLevel[\"Fatal\"] = 5] = \"Fatal\";\r\n    LogLevel[LogLevel[\"All\"] = 6] = \"All\";\r\n})(LogLevel || (LogLevel = {}));\r\nconst colors = ['#ffffff', '#00ff00', '#00ffff', '#ffff00', '#ff00ff', '#ff0000', '#ffffff'];\r\nconst maxLogLevel = LogLevel.Fatal;\r\nconst throwLogLevel = LogLevel.Error;\r\nconst clog = (message, logLevel, ...extra) => {\r\n    if (logLevel > maxLogLevel)\r\n        return;\r\n    console.log(`%c ${message}`, `color: ${colors[logLevel]}`, ...extra);\r\n    // TODO: Fix server crash due to client throw\r\n    if (logLevel >= throwLogLevel)\r\n        throw message;\r\n};\r\n//# sourceMappingURL=utils.js.map\n\n//# sourceURL=webpack:///./js/utils.js?");

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
/******/ 	__webpack_require__("./js/app.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;