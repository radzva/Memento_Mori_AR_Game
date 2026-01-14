
import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";

import { createScene } from "./scene.js";
import { createReticle } from "./ar.js";
import { loadAnimal } from "./animal.js";
import { setHint } from "./ui.js";
import { updateGame } from "./game.js";
import { FLOOR_Y, LOSE_RADIUS_M } from "./config.js";

// WebXR hit-test state.
// This is here because hit testing is driven by XR frames.
let hitTestSource = null;
let hitTestSourceRequested = false;

// Basic Three.js + WebXR setup (scene, camera, renderer)
const { scene, camera, renderer } = createScene();

// Add the WebXR AR button to the page
document.body.appendChild(
  ARButton.createButton(renderer, {
    requiredFeatures: ["hit-test"],
    optionalFeatures: ["dom-overlay"],
    domOverlay: { root: document.body }
  })
);

// Reticle shows where the user can place the animal
const reticle = createReticle();
scene.add(reticle);

// Game state
let animal = null;
let placed = false;
let gameOver = false;

// Controller represents a screen tap in WebXR
const controller = renderer.xr.getController(0);
scene.add(controller);

/**
 * Updates the placement reticle using WebXR hit testing.
 * This runs every XR frame while the session is active.
 */
function updateReticle(frame) {
  if (!frame) return;

  const referenceSpace = renderer.xr.getReferenceSpace();
  const session = renderer.xr.getSession();

  // Request hit-test source once per session
  if (!hitTestSourceRequested) {
    session.requestReferenceSpace("viewer").then((viewerSpace) => {
      session.requestHitTestSource({ space: viewerSpace }).then((source) => {
        hitTestSource = source;
      });
    });

    // Clean up when AR session ends
    session.addEventListener("end", () => {
      hitTestSourceRequested = false;
      hitTestSource = null;
    });

    hitTestSourceRequested = true;
  }

  // Update reticle position if a surface is detected
  if (hitTestSource) {
    const hitTestResults = frame.getHitTestResults(hitTestSource);

    if (hitTestResults.length > 0 && !placed) {
      const hit = hitTestResults[0];
      const pose = hit.getPose(referenceSpace);

      reticle.visible = true;
      reticle.matrix.fromArray(pose.transform.matrix);
    } else {
      reticle.visible = false;
    }
  }
}

// Handle screen tap: place the animal once
controller.addEventListener("select", () => {
  if (placed || !reticle.visible) return;

  // Load the GLTF animal asynchronously
  loadAnimal((model) => {
    animal = model;

    // Place the animal where the reticle is
    animal.position.setFromMatrixPosition(reticle.matrix);
    animal.position.y = FLOOR_Y;

    scene.add(animal);
    placed = true;

    // Show the salt circle and update instructions
    saltRing.visible = true;
    setHint("Walk away. If it reaches your salt circle, you lose.");
  });
});

// Visual "salt circle" around the player (lose radius)
const saltRing = new THREE.Mesh(
  new THREE.RingGeometry(
    LOSE_RADIUS_M * 0.95,
    LOSE_RADIUS_M * 1.05,
    64
  ).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  })
);

saltRing.visible = false;
scene.add(saltRing);

// Clock used for frame-rate independent movement
const clock = new THREE.Clock();

// Main render / update loop
renderer.setAnimationLoop((t, frame) => {
  const dt = Math.min(clock.getDelta(), 0.033);

  // Update placement reticle while AR session is running
  updateReticle(frame);

  // Update game logic (movement + lose condition)
  gameOver = updateGame({
    renderer,
    camera,
    animal,
    saltRing,
    placed,
    gameOver,
    dt
  });

  renderer.render(scene, camera);
});