import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Shared GLTF loader instance bc small project

const loader = new GLTFLoader();

export function loadAnimal(onReady) {
  loader.load("models/anubis.glb", (gltf) => {
    const model = gltf.scene;

    // Scale the model down to a reasonable AR size
    // SHOULD BE CHANGED IF USING A DIFFERENT MODEL
    model.scale.set(0.9, 0.9, 0.9);

    // Rotate to face forward by default
    model.rotation.y = Math.PI;

    // Apply a simple dark tint 
    // cheap effect, but works well in AR lighting
    model.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.color.multiplyScalar(0.6);
        obj.material.roughness = 1.0;
      }
    });


    
    onReady(model);
  });
}