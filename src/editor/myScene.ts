import * as THREE from 'three';
import { MeshPostProcessingMaterial } from 'three/examples/jsm/materials/MeshPostProcessingMaterial.js';

import { myRender } from '@src/main';

export class MyScene {
  renderer;
  scene;

  constructor(renderer, scene) {
    this.renderer = renderer;
    this.scene = scene;
  }

  init(position, reflection, rotY = 0) {
    const door = new THREE.Mesh(this.createGeometry(), this.createMaterial());

    // door.castShadow = true;
    // door.receiveShadow = true;
    //this.csg(door);
    if (reflection) this.setReflection(door.material);
    door.position.copy(position);
    door.rotateY(rotY);
    this.scene.add(door);
  }

  createGeometry() {
    const height = 1.9;
    const arr = [new THREE.Vector2(-1.5, 0.05), new THREE.Vector2(-1.5, -0.05), new THREE.Vector2(1.5, -0.05), new THREE.Vector2(1.5, 0.05)];
    const shape = new THREE.Shape(arr);
    const geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth: height });
    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();

    return geometry;
  }

  csg(door) {
    const side = [0.08, -0.08];

    // for (let i = 0; i < side.length; i++) {
    //   const box = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.7, 0.1), new THREE.MeshStandardMaterial({ color: 0x0000ff }));

    //   box.position.y = 1.7 / 2 + 0.1;
    //   box.position.z = side[i];

    //   box.updateMatrix();
    //   door.updateMatrix();

    //   const subRes = CSG.subtract(door, box);
    //   door.geometry.dispose();
    //   door.geometry = subRes.geometry;
    // }
  }

  createMaterial() {
    //const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const material = new MeshPostProcessingMaterial({ color: 0xffffff, aoPassMap: myRender.gtaoPass.gtaoMap });
    //this.createTexture(material);

    return material;
  }

  createTexture(material) {
    new THREE.TextureLoader().load('./assets/images/1.jpg', (image) => {
      const texture = image;
      material.color = new THREE.Color(0xffffff);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      texture.repeat.x = 1.0;
      texture.repeat.y = 1.0;
      texture.needsUpdate = true;

      material.map = texture;
      material.needsUpdate = true;
    });
  }

  setReflection(material) {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const cubeCamera = new THREE.CubeCamera(0.01, 10, new THREE.WebGLCubeRenderTarget(512, { encoding: THREE.sRGBEncoding }));

    cubeCamera.position.copy(new THREE.Vector3(0, 1, 0));
    cubeCamera.update(this.renderer, this.scene);

    const envMap = pmremGenerator.fromEquirectangular(cubeCamera.renderTarget.texture).texture;
    material.metalness = 0.7;
    material.roughness = 0.0;
    material.envMap = envMap;
    material.needsUpdate = true;

    envMap.dispose();
    cubeCamera.renderTarget.texture.dispose();

    pmremGenerator.dispose();
  }

  addPlane() {
    const size = 30;
    const divisions = 30;

    //const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const material = new MeshPostProcessingMaterial({ color: 0xffffff, aoPassMap: myRender.gtaoPass.gtaoMap });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
    plane.position.x = -0.001;
    plane.rotation.set(Math.PI / 2, Math.PI, 0);
    //plane.castShadow = true;
    //plane.receiveShadow = true;
    this.scene.add(plane);

    const gridHelper = new THREE.GridHelper(size, divisions);
    //this.scene.add(gridHelper);
  }
}
