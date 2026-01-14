import * as THREE from "three";
import * as THREE from "three";

/**
 * Creates and configures the base Three.js scene used for AR.
 * This keeps setup separate from game logic.
 */
export function createScene() {
  const scene = new THREE.Scene();

  // Camera is controlled by WebXR during the AR session
  const camera = new THREE.PerspectiveCamera();

  // Transparent renderer so the real-world camera feed shows through
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  // Simple ambient lighting that works well in most environments
  const hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 1.0);
  scene.add(hemi);

  document.body.appendChild(renderer.domElement);

  // Keep renderer sized correctly on orientation or window changes
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer };
}