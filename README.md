## Momento Mori AR game

Memento Mori AR is a small augmented reality game developed as part of the Virtual Environments course.
The result in a lightweight, phone-based AR experience accessed via a web link and running in Google Chrome, using browser-based augmented reality technologies to place and interact with virtual objects in the user’s physical environment.

---

## Running the Project

This project is a browser-based augmented reality experience built using WebXR.  
It runs entirely in Google Chrome on supported Android devices and requires a secure (HTTPS) context.

---

### Requirements

- Android smartphone with AR support
- Google Chrome (latest version recommended)
- Google Play Services for AR installed on the device
- Python 3 (for local development server)
- Cloudflare Tunnel (`cloudflared`) for HTTPS exposure

---

### 1. Start a Local Server

From the project root directory, start a local HTTP server:

```bash
python3 -m http.server 8080

---
### 2. Expose the Server via HTTPS

WebXR requires a secure context.
In a separate terminal, create a temporary HTTPS tunnel to the local server:

```bash
cloudflared tunnel --url http://localhost:8080

Cloudflare will output a public https:// URL.

---
### 3.  Launch on Mobile Device

    Open the generated HTTPS URL on your Android phone in Google Chrome

    Tap Enter AR

    Move the phone to allow surface detection

    Tap to place the creature on the floor

    Physically move away to avoid it

---
### Interaction Model

    Tap screen — place the creature

    Physical movement — maintain distance from the creature

    No on-screen controls — interaction is fully embodied

---
### Customisation

Core gameplay parameters can be adjusted in js/config.js:

export const CHASE_SPEED_MPS = 0.25;
export const LOSE_RADIUS_M  = 0.7;
export const FLOOR_Y        = -1;

The 3D model can be replaced by swapping:
```bash
models/anubis.glb

with any other model is /models OR any compatible .glb or .gltf asset.

---
### Tech Stack
    WebXR — browser-based augmented reality
    Three.js — 3D rendering and scene management
    ARCore — spatial tracking on Android (via WebXR)
    JavaScript (ES Modules) — application logic
    HTML / CSS — user interface and AR overlays
    GLTF / GLB — 3D asset format
    Cloudflare Tunnel — HTTPS access for local development