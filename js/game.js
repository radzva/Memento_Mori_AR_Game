import * as THREE from "three";
import { CHASE_SPEED_MPS, LOSE_RADIUS_M, FLOOR_Y } from "./config.js";
import { showLoseMessage } from "./ui.js";

// Reused vectors to avoid allocations every frame
const camPos = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();
const tmpDir = new THREE.Vector3();

/*
 * Runs one step of the game logic:
 *  - move the animal toward the player
 *  - update the salt circle position
 *  - check lose condition
 */
export function updateGame({
  renderer,
  camera,
  animal,
  saltRing,
  placed,
  gameOver,
  dt
}) {
  if (!placed || !animal || gameOver) return gameOver;

  
  // Get camera position and project it onto the floor
  renderer.xr.getCamera(camera).getWorldPosition(camPos);
  camPos.y = FLOOR_Y;

  // Keep the salt circle centered on the player
  saltRing.position.copy(camPos);

  // Direction from animal to player
  tmpTarget.copy(camPos);
  tmpDir.copy(tmpTarget).sub(animal.position);

  // Lose if the animal enters the salt circle
  const dist = tmpDir.length();
  if (dist <= LOSE_RADIUS_M) {
    showLoseMessage();
    return true;
  }

  // Move animal toward the player
  tmpDir.normalize();
  animal.position.addScaledVector(tmpDir, CHASE_SPEED_MPS * dt);

  // Rotate to face movement direction
  animal.rotation.y = Math.atan2(tmpDir.x, tmpDir.z);

  return false;
}
