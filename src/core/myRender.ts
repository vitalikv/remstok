import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

export class MyRender {
  composer: EffectComposer;
  gtaoPass;
  fxaaPass;

  init({ renderer, scene, camera }) {
    this.composer = new EffectComposer(renderer);

    const { width, height } = this.getWindowWH();

    const gtaoPass = new GTAOPass(scene, camera, width, height);
    gtaoPass.output = GTAOPass.OUTPUT.Normal;
    const renderPasse = new RenderPass(scene, camera);
    const outputPass = new OutputPass();
    const fxaaPass = new ShaderPass(FXAAShader);

    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);

    this.composer.addPass(gtaoPass);
    this.composer.addPass(renderPasse);
    this.composer.addPass(outputPass);
    this.composer.addPass(fxaaPass);

    gtaoPass.output = GTAOPass.OUTPUT.Default;
    gtaoPass.enabled = true;
    renderPasse.enabled = true;

    const sceneParameters = {
      output: 0,
      envMapIntensity: 1.0,
      ambientLightIntensity: 0.0,
      lightIntensity: 50,
      shadow: true,
    };
    const aoParameters = {
      radius: 0.01,
      distanceExponent: 2,
      thickness: 10,
      scale: 1,
      samples: 16,
      distanceFallOff: 0,
    };
    gtaoPass.updateGtaoMaterial(aoParameters);
    renderer.shadowMap.enabled = sceneParameters.shadow;

    this.gtaoPass = gtaoPass;
    this.fxaaPass = fxaaPass;

    window.addEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    const { width, height } = this.getWindowWH();

    const camera = this.composer.passes[0]['camera'];
    const renderer = this.composer.renderer;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    this.composer.setSize(width, height);

    const pixelRatio = renderer.getPixelRatio();
    this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
    this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
  };

  getWindowWH() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return { width, height };
  }

  render() {
    this.composer.render();
  }
}
