import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { CSG } from 'three-csg-ts';

import { MyRender } from './core/myRender';
import { MyScene } from './editor/myScene';

let renderer, camera, scene;
let controls;

export const myRender = new MyRender();

init();
render();

function init() {
  const bgColor = 0x263238 / 2;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(bgColor, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1.5, 1).multiplyScalar(50);
  light.shadow.mapSize.setScalar(2048);
  light.shadow.bias = -1e-4;
  light.shadow.normalBias = 0.05;
  light.castShadow = true;

  const shadowCam = light.shadow.camera;
  shadowCam.bottom = shadowCam.left = -30;
  shadowCam.top = 30;
  shadowCam.right = 45;

  //scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(5, 5, -5);
  camera.far = 1000;
  camera.updateProjectionMatrix();

  myRender.init({ renderer, scene, camera });

  controls = new OrbitControls(camera, renderer.domElement);

  const s1 = new MyScene(renderer, scene);
  const s2 = new MyScene(renderer, scene);

  s1.addPlane();
  s1.init(new THREE.Vector3(-0.0, 0, -1.5 / 2), false, Math.PI / 2);
  s2.init(new THREE.Vector3(1.5, 0, 1.5 / 2), false);
  s2.init(new THREE.Vector3(1.5 * 2, 0, -1.5 / 2), false, Math.PI / 2);
}

function render() {
  requestAnimationFrame(render);

  controls.update();

  //renderer.render(scene, camera);
  myRender.render();
}
