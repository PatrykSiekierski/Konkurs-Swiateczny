// import * as THREE from "https://unpkg.com/three/build/three.module.js";
import * as THREE from "./node_modules/three/build/three.module.js";

const scene = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(
  120,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);

const camera2 = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const camera3 = new THREE.PerspectiveCamera(
  120,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const camera4 = new THREE.PerspectiveCamera(
  120,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const degree = Math.PI / 180;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x6d9bc7);
document.body.appendChild(renderer.domElement);

const sky = new THREE.Mesh(
  new THREE.SphereGeometry(10000, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x6dcccc,
    side: THREE.BackSide,
  })
);
scene.add(sky);

//Droga
const roadGeometry = new THREE.BoxGeometry(8, 0.2, 90);
const roadMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xaaaaaa,
});
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.position.y = 0.1;
scene.add(road);

//Pasy (base 1, 0.2, 2)
function createPas(width, heigth, length, xPos, yPos, zPos) {
  const pasGeometry = new THREE.BoxGeometry(width, heigth, length);
  const pasMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
  });
  const pas = new THREE.Mesh(pasGeometry, pasMaterial);
  pas.position.x = xPos;
  pas.position.y = yPos;
  pas.position.z = zPos;
  scene.add(pas);
}

for (let i = 0; i < 30; i++) {
  createPas(1, 0.2, 2, 0, 0.11, 43 - i * 3);
}

//Chodnik
function sideWalk(posX, posY, posZ, length, width, height) {
  const roadGeometry = new THREE.BoxGeometry(width, height, length);
  const roadMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x999999,
  });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.position.x = posX;
  road.position.y = posY;
  road.position.z = posZ;
  scene.add(road);
}
sideWalk(-5, 0.2, 0, 90, 2, 0.4);
sideWalk(5, 0.2, 0, 90, 2, 0.4);

//Trawa
// const grassGeometry = new THREE.BoxGeometry(90, 0.1, 90);
// const grassMaterial = new THREE.MeshPhysicalMaterial({
//   color: 0xb0ffb0,
// });
// const grass = new THREE.Mesh(grassGeometry, grassMaterial);
// grass.position.y = 0;
const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    color: 0xbbffbb,
  })
);
grass.position.y = 0;
grass.rotation.x = degree * 270;
scene.add(grass);

const buildings = new THREE.Group();
function building(width, heigth, length, xPos, yPos, zPos) {
  const buildingAGeometry = new THREE.BoxGeometry(width, heigth, length);
  const buildingAMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x777777,
  });
  const buildingA = new THREE.Mesh(buildingAGeometry, buildingAMaterial);
  buildingA.position.x = xPos;
  buildingA.position.y = yPos;
  buildingA.position.z = zPos;

  return buildingA;
  // scene.add(buildingA);
}
let building1 = building(6, 20, 15, 9, 10, 27.5);
const building1Box = new THREE.Box3().setFromObject(building1);
buildings.add(building1);

let building2 = building(6, 12, 25, -9, 6, -22.5);
const building2Box = new THREE.Box3().setFromObject(building2);
buildings.add(building2);

// building(6, 12, 25, -9, 6, -22.5);

scene.add(buildings);

//SquareLife
const lifeGeometry = new THREE.CapsuleGeometry(0.5, 2.5, 4, 8);
const lifeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
});
const life = new THREE.Mesh(lifeGeometry, lifeMaterial);
const lifeBox = new THREE.Box3().setFromObject(life);
// const player = new THREE.Group();
// player.add(life);
// player.add(camera1);

life.position.x = 0;
life.position.y = 2;
life.position.z = 42;
scene.add(life);

//Kamera
camera1.position.z = 42;
camera1.position.y = 2;

camera2.position.y = 20;
camera2.position.z = 50;
camera2.rotation.x = 118.8;

camera3.position.x = 6.4;
camera3.position.y = 22;
camera3.position.z = 20.2;
camera3.rotation.y = degree * 30;

// camera4.rotation.order = "YXZ";
camera4.position.x = -6.4;
camera4.position.y = 14;
camera4.position.z = -10.5;
camera4.rotation.y = degree * 210;
// camera4.rotation.z = degree * 10;

//Mgła
let fog = new THREE.FogExp2(0xdfe9f3, 0.04);
scene.fog = fog;

//Światło
// const pointLight = new THREE.PointLight(0xffffff, 100);
// pointLight.position.x = 0;
// pointLight.position.y = 20;
// // scene.add(pointLight);

// const pointLight2 = new THREE.PointLight(0xecfc03, 10000);
// pointLight2.position.x = 0;
// pointLight2.position.y = 20;
// // scene.add(pointLight2);

const directionalLight = new THREE.DirectionalLight(0xffff00, 1);
directionalLight.position.z = 20;
directionalLight.position.y = 10;
scene.add(directionalLight);

const ambientWhiteLight = new THREE.AmbientLight(0x404040, 5);
const ambientYellowLight = new THREE.AmbientLight(0xffff00, 0.6);
const ambientBlueLight = new THREE.AmbientLight(0x0000ff, 0.8);
const ambientRedLight = new THREE.AmbientLight(0xff0000, 0.3);
scene.add(ambientWhiteLight);
scene.add(ambientYellowLight);
scene.add(ambientBlueLight);
scene.add(ambientRedLight);

// Sterowanie
const keys = {
  w: false,
  s: false,
  a: false,
  d: false,
};

let currentCamera = camera1;
document.addEventListener("keydown", (event) => {
  if (event.key == " " || event.code == "Space") {
    if (haveJumped) return;
    haveJumped = true;
    beforeJumpPosition = life.position.y;
    console.log(beforeJumpPosition);
  }
  if (event.key in keys) keys[event.key] = true;
  if (currentCamera == camera1) return;
  currentCamera.rotation.order = "YXZ";

  let rotationAmmount = degree * 5;
  if (event.key == "ArrowRight") currentCamera.rotation.y -= rotationAmmount;
  if (event.key == "ArrowLeft") currentCamera.rotation.y += rotationAmmount;
  if (event.key == "ArrowUp") currentCamera.rotation.x += rotationAmmount;
  if (event.key == "ArrowDown") currentCamera.rotation.x -= rotationAmmount;
});

document.addEventListener("keyup", (event) => {
  if (event.key in keys) keys[event.key] = false;
});

document.addEventListener("keydown", (event) => {
  if (event.key == "1") currentCamera = camera1;
  if (event.key == "2") currentCamera = camera2;
  if (event.key == "3") currentCamera = camera3;
  if (event.key == "4") currentCamera = camera4;
});

//Movement
let baseMovementValue = 0.35;
function playerMovement(byZ, byY = 0) {
  camera1.translateZ(byZ);
  life.translateZ(byZ);

  camera1.translateY(byY);
  life.translateY(byY);
  lifeBox.setFromObject(life);
}

let gravityStrength = 0.1;
function gravity() {
  playerMovement(0, -gravityStrength);
}

let haveJumped = false;
let jumpPower = 0.5;
let currentJumpPower = jumpPower;
function jumping() {
  playerMovement(0, currentJumpPower);
  currentJumpPower -= 0.025 + currentJumpPower * 0.015;
}

let beforeJumpPosition = 2;
const fps = 60; // Target FPS
const interval = 1000 / fps; // Time per frame in milliseconds
let lastTime = 0;

function animate(currentTime) {
  // Schedule the next frame (only once)
  requestAnimationFrame(animate);

  // Calculate deltaTime
  const deltaTime = currentTime - lastTime;

  if (deltaTime >= interval) {
    // Update lastTime, accounting for any drift
    lastTime = currentTime - (deltaTime % interval);

    // Jumping
    if (haveJumped) {
      jumping();
      gravity();
    }
    if (life.position.y <= beforeJumpPosition) {
      haveJumped = false;
      currentJumpPower = jumpPower;
      camera1.position.y = beforeJumpPosition;
      life.position.y = beforeJumpPosition;
      lifeBox.setFromObject(life);
    }

    // Movement
    if (keys.w) {
      playerMovement(-baseMovementValue);
      if (lifeBox.intersectsBox(building1Box)) {
        playerMovement(baseMovementValue);
        console.log("hhh");
      }
    }
    if (keys.s) {
      camera1.translateZ(baseMovementValue);
      life.translateZ(baseMovementValue);
      lifeBox.setFromObject(life);
    }

    if (keys.a) {
      camera1.rotation.y += 0.05;
      life.rotation.y += 0.05;
      lifeBox.setFromObject(life);
    }
    3;
    if (keys.d) {
      camera1.rotation.y -= 0.05;
      life.rotation.y -= 0.05;
      lifeBox.setFromObject(life);
    }

    renderer.render(scene, currentCamera);
  }
}

requestAnimationFrame(animate);
