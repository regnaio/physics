(()=>{"use strict";var t,e,i,s,o;!function(t){t[t.ACTIVE_TAG=1]="ACTIVE_TAG",t[t.ISLAND_SLEEPING=2]="ISLAND_SLEEPING",t[t.WANTS_DEACTIVATION=3]="WANTS_DEACTIVATION",t[t.DISABLE_DEACTIVATION=4]="DISABLE_DEACTIVATION",t[t.DISABLE_SIMULATION=5]="DISABLE_SIMULATION"}(t||(t={})),function(t){t[t.CF_STATIC_OBJECT=1]="CF_STATIC_OBJECT",t[t.CF_KINEMATIC_OBJECT=2]="CF_KINEMATIC_OBJECT",t[t.CF_NO_CONTACT_RESPONSE=4]="CF_NO_CONTACT_RESPONSE",t[t.CF_CUSTOM_MATERIAL_CALLBACK=8]="CF_CUSTOM_MATERIAL_CALLBACK",t[t.CF_CHARACTER_OBJECT=16]="CF_CHARACTER_OBJECT",t[t.CF_DISABLE_VISUALIZE_OBJECT=32]="CF_DISABLE_VISUALIZE_OBJECT",t[t.CF_DISABLE_SPU_COLLISION_PROCESSING=64]="CF_DISABLE_SPU_COLLISION_PROCESSING"}(e||(e={})),function(t){t[t.Environment=1]="Environment",t[t.Other=2]="Other"}(i||(i={})),function(t){t[t.Environment=2]="Environment",t[t.Other=3]="Other"}(s||(s={}));class n{constructor(){this._fps=new Stats,this._frameRenderDuration=new Stats,this._memory=new Stats,this._datGUI=new dat.GUI({hideable:!1}),this._datData={add:()=>{},remove:()=>{},numToAdd:0,physicsStepComputeTime:0},this._shouldUpdatePhysicsStepComputeTime=!1,document.body.appendChild(this._fps.dom),this._fps.dom.style.cssText="position:absolute;top:0px;left:0px;z-index:4",this._fps.showPanel(0),document.body.appendChild(this._frameRenderDuration.dom),this._frameRenderDuration.dom.style.cssText="position:absolute;top:0px;left:80px;z-index:4",this._frameRenderDuration.showPanel(1),document.body.appendChild(this._memory.dom),this._memory.dom.style.cssText="position:absolute;top:0px;left:160px;z-index:4",this._memory.showPanel(2),this._datGUI.domElement.style.cssText="position:absolute;top:0px;right:0px;z-index:4",setInterval((()=>{this._shouldUpdatePhysicsStepComputeTime=!0}),500)}get datData(){return this._datData}init(){const t=this._datGUI.addFolder("Folder");t.open(),t.add(this._datData,"add").name("Click to add"),t.add(this._datData,"remove").name("Click to remove all"),t.add(this._datData,"numToAdd",0,1e3,100).name("# to add").step(1).listen(),t.add(this._datData,"physicsStepComputeTime").name("Physics").step(.01).listen()}update(){this._fps.update(),this._frameRenderDuration.update(),this._memory.update()}updatePhysicsStepComputeTime(t){this._shouldUpdatePhysicsStepComputeTime&&(this._datData.physicsStepComputeTime=t,this._shouldUpdatePhysicsStepComputeTime=!1)}}function a(t){const e=100,i=BABYLON.Mesh.CreateLines("axisX",[new BABYLON.Vector3,new BABYLON.Vector3(e,0,0),new BABYLON.Vector3(95,5,0),new BABYLON.Vector3(e,0,0),new BABYLON.Vector3(95,-5,0)],t);i.isPickable=!1,i.color=new BABYLON.Color3(1,0,0);const s=BABYLON.Mesh.CreateLines("axisY",[new BABYLON.Vector3,new BABYLON.Vector3(0,e,0),new BABYLON.Vector3(-5,95,0),new BABYLON.Vector3(0,e,0),new BABYLON.Vector3(5,95,0)],t);s.isPickable=!1,s.color=new BABYLON.Color3(0,1,0);const o=BABYLON.Mesh.CreateLines("axisZ",[new BABYLON.Vector3,new BABYLON.Vector3(0,0,e),new BABYLON.Vector3(0,-5,95),new BABYLON.Vector3(0,0,e),new BABYLON.Vector3(0,5,95)],t);o.isPickable=!1,o.color=new BABYLON.Color3(0,0,1)}!function(t){t[t.None=0]="None",t[t.Debug=1]="Debug",t[t.Info=2]="Info",t[t.Warn=3]="Warn",t[t.Error=4]="Error",t[t.Fatal=5]="Fatal",t[t.All=6]="All"}(o||(o={}));const r=["#ffffff","#00ff00","#00ffff","#ffff00","#ff00ff","#ff0000","#ffffff"],c=o.Fatal,d=o.Error;function h(t,e,...i){if(!(e>c)&&(console.log(`%c ${t}`,`color: ${r[e]}`,...i),e>=d))throw t}var m;!function(t){t[t.Main=0]="Main",t[t.Worker=1]="Worker"}(m||(m={}));const _=["#660000","#000066"];function l(){return void 0!==performance?performance.now():Date.now()}function B(t,e){return Math.random()*(e-t)+t}class u{constructor(){this._canvas=document.getElementById("renderCanvas"),this._engine=new BABYLON.Engine(this._canvas,!0,{deterministicLockstep:!0,lockstepMaxSteps:4}),this._scene=new BABYLON.Scene(this._engine),this._camera=new BABYLON.ArcRotateCamera("",0,Math.PI/4,100,new BABYLON.Vector3,this._scene),this._light=new BABYLON.HemisphericLight("",new BABYLON.Vector3(0,100,0),this._scene),this._gui=new n,this._instancedMeshes=new Array,h("NoWorker",o.Info),this.setupCamera(),this.setupPhysics(),a(this._scene),this._engine.runRenderLoop((()=>{this._scene.render(),this._gui.update()})),window.onresize=()=>{this._engine.resize()}}setupCamera(){this._camera.keysUp=[],this._camera.keysLeft=[],this._camera.keysDown=[],this._camera.keysRight=[],this._camera.attachControl(this._canvas,!1),this._camera.setTarget(new BABYLON.Vector3(0,10,0))}async setupPhysics(){try{"function"==typeof Ammo&&await Ammo();const t=new BABYLON.AmmoJSPlugin(!1);this._scene.enablePhysics(new BABYLON.Vector3(0,-9.8,0),t),h(`_engine.isDeterministicLockStep(): ${this._engine.isDeterministicLockStep()}`,o.Info),h(`_engine.getLockstepMaxSteps(): ${this._engine.getLockstepMaxSteps()}`,o.Info),h(`_engine.getTimeStep(): ${this._engine.getTimeStep()}`,o.Info),h(`physEngine.getTimeStep(): ${t.getTimeStep()}`,o.Info),h(`_scene.getPhysicsEngine()?.getTimeStep(): ${this._scene.getPhysicsEngine()?.getTimeStep()}`,o.Info),h(`_scene.getPhysicsEngine()?.getSubTimeStep(): ${this._scene.getPhysicsEngine()?.getSubTimeStep()}`,o.Info),this.loadEnvironment(),this.setupGUI()}catch(t){h("setupPhysics(): err",o.Fatal,t)}}loadEnvironment(){const o=BABYLON.MeshBuilder.CreateBox("",{width:50,height:1,depth:50},this._scene),n=new BABYLON.StandardMaterial("",this._scene);n.diffuseColor=new BABYLON.Color3(.5,.5,.5),n.freeze(),o.material=n,o.position.y-=.5,o.freezeWorldMatrix(),o.physicsImpostor=new BABYLON.PhysicsImpostor(o,BABYLON.PhysicsImpostor.BoxImpostor,{mass:0,friction:1,restitution:.5,group:i.Environment,mask:s.Environment},this._scene),o.physicsImpostor.physicsBody.setActivationState(t.DISABLE_DEACTIVATION),o.physicsImpostor.physicsBody.setCollisionFlags(e.CF_STATIC_OBJECT);const a=BABYLON.MeshBuilder.CreateBox("",{width:10,height:1,depth:20},this._scene),r=new BABYLON.StandardMaterial("",this._scene);r.diffuseColor=new BABYLON.Color3(1,0,0),r.freeze(),a.material=r,a.position.x-=10,a.rotationQuaternion=new BABYLON.Vector3(-Math.PI/6,0,0).toQuaternion(),a.freezeWorldMatrix(),a.physicsImpostor=new BABYLON.PhysicsImpostor(a,BABYLON.PhysicsImpostor.BoxImpostor,{mass:0,friction:1,restitution:.5,group:i.Environment,mask:s.Environment},this._scene),a.physicsImpostor.physicsBody.setActivationState(t.DISABLE_DEACTIVATION),a.physicsImpostor.physicsBody.setCollisionFlags(e.CF_STATIC_OBJECT)}setupGUI(){const e=BABYLON.MeshBuilder.CreateBox("",{width:.5},this._scene),n=new BABYLON.StandardMaterial("",this._scene);n.diffuseColor=new BABYLON.Color3(1,1,0),e.material=n,this._gui.datData.add=()=>{h("Add",o.Debug),this._gui.datData.remove();const{numToAdd:n}=this._gui.datData;this._instancedMeshes=new Array(n);for(let o=0;o<n;o++){const n=e.createInstance("");n.position=new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-10,10),50,BABYLON.Scalar.RandomRange(-10,10)),n.rotationQuaternion=new BABYLON.Vector3(BABYLON.Scalar.RandomRange(-Math.PI,Math.PI),BABYLON.Scalar.RandomRange(-Math.PI,Math.PI),BABYLON.Scalar.RandomRange(-Math.PI,Math.PI)).toQuaternion(),n.physicsImpostor=new BABYLON.PhysicsImpostor(n,BABYLON.PhysicsImpostor.BoxImpostor,{mass:1,friction:1,restitution:.5,group:i.Other,mask:s.Other},this._scene),n.physicsImpostor.physicsBody.setActivationState(t.DISABLE_DEACTIVATION),this._instancedMeshes[o]=n}},this._gui.datData.remove=()=>{h("Remove",o.Debug),this._instancedMeshes.forEach((t=>{t.physicsImpostor?.dispose(),t.dispose()}))},this._gui.datData.numToAdd=500,this._gui.datData.physicsStepComputeTime=0,this._gui.init(),e.setEnabled(!1);let a=l();this._scene.onBeforeStepObservable.add((()=>{const t=l();a=t})),this._scene.onAfterStepObservable.add((()=>{const t=l()-a;this._gui.updatePhysicsStepComputeTime(t)}))}}class p{constructor(t,e,i,s){this._colShape=t,this._options=s,this._transform=new Ammo.btTransform,this._localInertia=new Ammo.btVector3(0,0,0);const{mass:o,friction:n,restitution:a,activationState:r,collisionFlag:c}=this._options;this._transform.setIdentity(),this._transform.setOrigin(e),this._transform.setRotation(i),this._motionState=new Ammo.btDefaultMotionState(this._transform),0!==o&&this._colShape.calculateLocalInertia(o,this._localInertia),this._rbInfo=new Ammo.btRigidBodyConstructionInfo(o,this._motionState,this._colShape,this._localInertia),this._rigidBody=new Ammo.btRigidBody(this._rbInfo),void 0!==n&&this._rigidBody.setFriction(n),void 0!==a&&this._rigidBody.setRestitution(a),void 0!==r&&this._rigidBody.setActivationState(r),void 0!==c&&this._rigidBody.setCollisionFlags(c)}getMotionState(){return this._rigidBody.getMotionState()}getOrigin(){return this._rigidBody.getWorldTransform().getOrigin()}getRotation(){return this._rigidBody.getWorldTransform().getRotation()}add(t){const{collisionFilterGroup:e,collisionFilterMask:i}=this._options;void 0!==e&&void 0!==i?t.addRigidBody(this._rigidBody,e,i):t.addRigidBody(this._rigidBody)}remove(t){t.removeRigidBody(this._rigidBody)}destroy(){Ammo.destroy(this._rigidBody),Ammo.destroy(this._rbInfo),Ammo.destroy(this._motionState),Ammo.destroy(this._transform),Ammo.destroy(this._localInertia)}}let A,g;class f{constructor(t){this._fixedTimeStep=1/60,this._accumulator=0,this._maxSteps=4,this._maxSubSteps=0,this._onPhysicsUpdate=(t,e)=>{},this._rigidBodies=new Array,this._motionStates=new Array,this._didAdd=!1,this.init(t)}set onPhysicsUpdate(t){this._onPhysicsUpdate=t}async init(t){try{"function"==typeof Ammo&&(void 0!==t?await Ammo({locateFile:()=>t}):await Ammo()),A={btVector3A:new Ammo.btVector3(0,0,0),btVector3B:new Ammo.btVector3(0,0,0),btTransformA:new Ammo.btTransform,btQuaternionA:new Ammo.btQuaternion(0,0,0,1)},g={concreteContactResultCallback:new Ammo.ConcreteContactResultCallback,concreteContactPosition:new Ammo.btVector3(0,0,0),concreteContactResult:!1,closestRayResultCallback:new Ammo.ClosestRayResultCallback(A.btVector3A,A.btVector3B)};const e=new Ammo.btDefaultCollisionConfiguration,i=new Ammo.btCollisionDispatcher(e),s=new Ammo.btDbvtBroadphase,o=new Ammo.btSequentialImpulseConstraintSolver;this._dynamicsWorld=new Ammo.btDiscreteDynamicsWorld(i,s,o,e);const{btVector3A:n}=A;n.setValue(0,-9.8,0),this._dynamicsWorld.setGravity(n),this.setupCallbacks(),this.loadEnvironment()}catch(t){console.log("init(): err",t)}}setupCallbacks(){const{concreteContactResultCallback:t,concreteContactPosition:e}=g;t.addSingleResult=(t,i,s,n,a,r,c)=>{const d=Ammo.wrapPointer(t,Ammo.btManifoldPoint),m=d.getDistance();if(m>0)return h(`concreteContactResultCallback.addSingleResult(): distance ${m} > 0`,o.Warn),0;const _=Ammo.wrapPointer(i,Ammo.btCollisionObjectWrapper),l=Ammo.castObject(_.getCollisionObject(),Ammo.btRigidBody),B=Ammo.wrapPointer(a,Ammo.btCollisionObjectWrapper),u=Ammo.castObject(B.getCollisionObject(),Ammo.btRigidBody);h("concreteContactResultCallback.addSingleResult(): colObj0, rb0",o.Debug,_,l),h("concreteContactResultCallback.addSingleResult(): colObj1, rb1",o.Debug,B,u);const p=d.getPositionWorldOnA();return e.setValue(p.x(),p.y(),p.z()),g.concreteContactResult=!0,0}}loadEnvironment(){if(void 0===this._dynamicsWorld)return void h("loadEnvironment(): _dynamicsWorld === undefined",o.Error);const{btVector3A:n,btQuaternionA:a}=A;n.setValue(25,.5,25);const r=new Ammo.btBoxShape(n);n.setValue(0,-.5,0),a.setValue(0,0,0,1),new p(r,n,a,{mass:0,friction:1,restitution:.5,activationState:t.DISABLE_DEACTIVATION,collisionFlag:e.CF_STATIC_OBJECT,collisionFilterGroup:i.Environment,collisionFilterMask:s.Environment}).add(this._dynamicsWorld),n.setValue(5,.5,10);const c=new Ammo.btBoxShape(n);n.setValue(-10,0,0),a.setEulerZYX(0,0,-Math.PI/6),new p(c,n,a,{mass:0,friction:1,restitution:.5,activationState:t.DISABLE_DEACTIVATION,collisionFlag:e.CF_STATIC_OBJECT,collisionFilterGroup:i.Environment,collisionFilterMask:s.Environment}).add(this._dynamicsWorld)}add(e){if(h("add()",o.Debug),void 0===this._dynamicsWorld)return void h("add(): _dynamicsWorld === undefined",o.Error);const{btVector3A:n,btQuaternionA:a}=A;n.setValue(.25,.5,.5);const r=new Ammo.btBoxShape(n);this._rigidBodies=new Array(e),this._motionStates=new Array(e);for(let o=0;o<e;o++){n.setValue(B(-10,10),50,B(-10,10)),a.setEulerZYX(B(-Math.PI,Math.PI),B(-Math.PI,Math.PI),B(-Math.PI,Math.PI));const e=new p(r,n,a,{mass:1,friction:1,restitution:.5,activationState:t.DISABLE_DEACTIVATION,collisionFilterGroup:i.Other,collisionFilterMask:s.Other});e.add(this._dynamicsWorld),this._rigidBodies[o]=e}this._didAdd=!0}remove(){if(void 0!==this._dynamicsWorld){for(const t of this._rigidBodies)t.remove(this._dynamicsWorld),t.destroy();this._rigidBodies=[],this._motionStates=[],this._didAdd=!1}else h("remove(): _dynamicsWorld === undefined",o.Error)}onRenderUpdate(t){if(void 0===this._dynamicsWorld)return void h("onRenderUpdate(): _dynamicsWorld === undefined",o.Warn);t=Math.max(.001,Math.min(t,1)),this._accumulator+=t;const{btTransformA:e}=A;let i=0;for(;this._accumulator>=this._fixedTimeStep&&i<this._maxSteps;){const t=l();if(this._dynamicsWorld.stepSimulation(this._fixedTimeStep,this._maxSubSteps),this._didAdd)for(const[t,i]of this._rigidBodies.entries()){if(void 0===i)break;const s=i.getMotionState();if(s){s.getWorldTransform(e);const i=e.getOrigin(),o=e.getRotation();this._motionStates[t]={position:{x:i.x(),y:i.y(),z:i.z()},rotation:{x:o.x(),y:o.y(),z:o.z(),w:o.w()}}}else h("onRenderUpdate(): !motionState",o.Error)}this._onPhysicsUpdate([...this._motionStates],l()-t),this._accumulator-=this._fixedTimeStep,i++}}}class C{constructor(){this._canvas=document.getElementById("renderCanvas"),this._engine=new BABYLON.Engine(this._canvas),this._scene=new BABYLON.Scene(this._engine),this._camera=new BABYLON.ArcRotateCamera("",0,Math.PI/4,100,new BABYLON.Vector3,this._scene),this._light=new BABYLON.HemisphericLight("",new BABYLON.Vector3(0,100,0),this._scene),this._gui=new n,this._physics=new f,this._instancedMeshes=new Array,h("NoWorker",o.Info),this.setupCamera(),this.loadEnvironment(),this.setupGUI(),this._physics.onPhysicsUpdate=(t,e)=>{for(const[e,i]of t.entries()){if(void 0===i)break;const{position:t,rotation:s}=i,o=this._instancedMeshes[e];void 0===o.rotationQuaternion&&(o.rotationQuaternion=new BABYLON.Quaternion),o.position.set(t.x,t.y,t.z),o.rotationQuaternion?.set(s.x,s.y,s.z,s.w)}this._gui.updatePhysicsStepComputeTime(e)},a(this._scene),this._scene.registerBeforeRender((()=>{this._physics.onRenderUpdate(this._engine.getDeltaTime()/1e3)})),this._engine.runRenderLoop((()=>{this._scene.render(),this._gui.update()})),window.onresize=()=>{this._engine.resize()}}setupCamera(){this._camera.keysUp=[],this._camera.keysLeft=[],this._camera.keysDown=[],this._camera.keysRight=[],this._camera.attachControl(this._canvas,!1),this._camera.setTarget(new BABYLON.Vector3(0,10,0))}loadEnvironment(){const t=BABYLON.MeshBuilder.CreateBox("",{width:50,height:1,depth:50},this._scene),e=new BABYLON.StandardMaterial("",this._scene);e.diffuseColor=new BABYLON.Color3(.5,.5,.5),e.freeze(),t.material=e,t.position.y-=.5,t.freezeWorldMatrix();const i=BABYLON.MeshBuilder.CreateBox("",{width:10,height:1,depth:20},this._scene),s=new BABYLON.StandardMaterial("",this._scene);s.diffuseColor=new BABYLON.Color3(1,0,0),s.freeze(),i.material=s,i.position.x-=10,i.rotationQuaternion=new BABYLON.Vector3(-Math.PI/6,0,0).toQuaternion(),i.freezeWorldMatrix()}setupGUI(){const t=BABYLON.MeshBuilder.CreateBox("",{width:.5},this._scene),e=new BABYLON.StandardMaterial("",this._scene);e.diffuseColor=new BABYLON.Color3(1,1,0),t.material=e,this._gui.datData.add=()=>{h("Add",o.Debug),this._gui.datData.remove();const{numToAdd:e}=this._gui.datData;for(let i=0;i<e;i++){const e=t.createInstance("");e.rotationQuaternion=new BABYLON.Quaternion,this._instancedMeshes[i]=e}this._physics.add(e)},this._gui.datData.remove=()=>{h("Remove",o.Debug),this._instancedMeshes.forEach((t=>{t.dispose()})),this._physics.remove()},this._gui.datData.numToAdd=500,this._gui.datData.physicsStepComputeTime=0,this._gui.init(),t.setEnabled(!1)}}var y;!function(t){t[t.Render=0]="Render",t[t.Step=1]="Step",t[t.Add=2]="Add",t[t.Remove=3]="Remove"}(y||(y={}));class w{constructor(){this._canvas=document.getElementById("renderCanvas"),this._engine=new BABYLON.Engine(this._canvas),this._scene=new BABYLON.Scene(this._engine),this._camera=new BABYLON.ArcRotateCamera("",0,Math.PI/4,100,new BABYLON.Vector3,this._scene),this._light=new BABYLON.HemisphericLight("",new BABYLON.Vector3(0,100,0),this._scene),this._gui=new n,this._worker=new Worker("../dist/worker.js"),this._instancedMeshes=new Array,h("WithWorker",o.Info),this.setupCamera(),this.setupWorker(),this.setupGUI(),this.loadEnvironment(),a(this._scene);let t=0;this._scene.registerBeforeRender((()=>{!function(t,e,i,...s){if(!(e>c)&&(console.log(`%c ${t}`,`color: ${r[e]}; background: ${_[i]}`,...s),e>=d))throw t}(`messageNum: ${t}`,o.Debug,m.Main);const e={type:y.Render,data:this._engine.getDeltaTime()/1e3};this._worker.postMessage(JSON.stringify(e)),t++})),this._engine.runRenderLoop((()=>{this._scene.render(),this._gui.update()})),window.onresize=()=>{this._engine.resize()}}setupCamera(){this._camera.keysUp=[],this._camera.keysLeft=[],this._camera.keysDown=[],this._camera.keysRight=[],this._camera.attachControl(this._canvas,!1),this._camera.setTarget(new BABYLON.Vector3(0,10,0))}setupWorker(){this._worker.onmessage=t=>{const e=JSON.parse(t.data);switch(e.type){case y.Render:break;case y.Step:const{motionStates:t,physicsStepComputeTime:i}=e.data;this.onPhysicsUpdate(t,i);break;case y.Add:case y.Remove:}}}loadEnvironment(){const t=BABYLON.MeshBuilder.CreateBox("",{width:50,height:1,depth:50},this._scene),e=new BABYLON.StandardMaterial("",this._scene);e.diffuseColor=new BABYLON.Color3(.5,.5,.5),e.freeze(),t.material=e,t.position.y-=.5,t.freezeWorldMatrix();const i=BABYLON.MeshBuilder.CreateBox("",{width:10,height:1,depth:20},this._scene),s=new BABYLON.StandardMaterial("",this._scene);s.diffuseColor=new BABYLON.Color3(1,0,0),s.freeze(),i.material=s,i.position.x-=10,i.rotationQuaternion=new BABYLON.Vector3(-Math.PI/6,0,0).toQuaternion(),i.freezeWorldMatrix()}setupGUI(){const t=BABYLON.MeshBuilder.CreateBox("",{width:.5},this._scene),e=new BABYLON.StandardMaterial("",this._scene);e.diffuseColor=new BABYLON.Color3(1,1,0),t.material=e,this._gui.datData.add=()=>{h("Add",o.Debug),this._gui.datData.remove();const{numToAdd:e}=this._gui.datData;for(let i=0;i<e;i++){const e=t.createInstance("");e.rotationQuaternion=new BABYLON.Quaternion,this._instancedMeshes[i]=e}const i={type:y.Add,data:e};this._worker.postMessage(JSON.stringify(i))},this._gui.datData.remove=()=>{h("Remove",o.Debug),this._instancedMeshes.forEach((t=>{t.dispose()}));const t={type:y.Remove,data:void 0};this._worker.postMessage(JSON.stringify(t))},this._gui.datData.numToAdd=500,this._gui.datData.physicsStepComputeTime=0,this._gui.init(),t.setEnabled(!1)}onPhysicsUpdate(t,e){for(const[e,i]of t.entries()){if(void 0===i)break;const{position:t,rotation:s}=i,o=this._instancedMeshes[e];void 0===o.rotationQuaternion&&(o.rotationQuaternion=new BABYLON.Quaternion),o.position.set(t.x,t.y,t.z),o.rotationQuaternion?.set(s.x,s.y,s.z,s.w)}this._gui.updatePhysicsStepComputeTime(e)}}const O=window.location.pathname.split("/"),S=O.pop()||O.pop();switch(h(`route: ${S}`,o.Info),S){case"noworkerbabylon":new u;break;case"noworker":new C;break;case"withworker":new w;break;default:h(`Invalid route ${S}`,o.Error)}})();