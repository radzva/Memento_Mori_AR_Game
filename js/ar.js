import * as THREE from "three";

/*
 * This creates a simple placement reticle used for AR hit testing.
 * The transform is updated manually from WebXR hit-test results.
 */
export function createReticle() {
  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.10, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

  // Control the matrix directly from hit-test pose
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;

  return reticle;
}