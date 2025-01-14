import * as THREE from "./node_modules/three/build/three.module.js";
import * as CANNON from "./node_modules/cannon-es/dist/cannon-es.js";

//Set up
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  120,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);

function degree(degree) {
  return (Math.PI / 180) * degree;
}

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x6d9bc7);
document.body.appendChild(renderer.domElement);

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});

const timeStep = 1 / 60;

const sky = new THREE.Mesh(
  new THREE.SphereGeometry(10000, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x222222,
    side: THREE.BackSide,
  })
);
scene.add(sky);

//Grass
const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({
    // color: 0xbbffbb,
    map: new THREE.TextureLoader().load("./textures/" + "snowy_ground.jpg"),
    side: THREE.DoubleSide,
  })
);
grass.receiveShadow = true;
scene.add(grass);

const grassBody = new CANNON.Body({
  shape: new CANNON.Plane(),
  type: CANNON.Body.STATIC,
});
world.addBody(grassBody);
grassBody.quaternion.setFromEuler(degree(270), 0, 0);

function createPlatform(x, y, z, length, height, width, rotX, rotZ) {
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(length, height, width),
    new THREE.MeshStandardMaterial({
      color: 0x5f3400,
      //   map: new THREE.TextureLoader().load("./textures/" + "plank.jpg"),
    })
  );
  platform.receiveShadow = true;
  scene.add(platform);

  const platformBody = new CANNON.Body({
    // mass: 1000,
    shape: new CANNON.Box(new CANNON.Vec3(length / 2, height / 2, width / 2)),
    position: new CANNON.Vec3(x, y, z),
    type: CANNON.Body.STATIC,
  });
  platformBody.quaternion.x = degree(rotX);
  platformBody.quaternion.z = degree(rotZ);
  world.addBody(platformBody);

  let platforms = [platform, platformBody];
  return platforms;
}
let platforms = [];
// platforms.push(createPlatform(0, 5, 0, 10, 10, 10, 0, 0));
platforms.push(createPlatform(0, 5, 34, 5, 1, 20, 0, 0));
platforms.push(createPlatform(-10, 5, 24, 25, 1, 5, 0, 0));
platforms.push(createPlatform(-26, 5, 24, 7, 1, 1.5, 0, 0));
platforms.push(createPlatform(-30, 5, 24, 8, 1, 4, 0, 0));
platforms.push(createPlatform(-36, 5, 24, 4, 1, 2, 0, 0));
platforms.push(createPlatform(-37, 5, 20, 2, 1, 6, 0, 0));
platforms.push(createPlatform(-37, 5, 7, 4, 1, 20, 0, 0));
platforms.push(createPlatform(-37, 6, -4, 4, 1, 4, 15, 0));
platforms.push(createPlatform(-37, 6, -10, 4, 1, 4, -15, 0));
platforms.push(createPlatform(-37, 5, -16, 4, 1, 12, 0, 0));
platforms.push(createPlatform(-37, 10, -30, 4, 1, 20, 15, 0));
platforms.push(createPlatform(-37, 15, -40, 4, 1, 4, 0, 0));
platforms.push(createPlatform(-27, 18, -40, 20, 1, 4, 0, 10));
platforms.push(createPlatform(-16, 21, -40, 4, 1, 4, 0, 0));
platforms.push(createPlatform(-10, 21, -40, 10, 1, 4, 0, 0));
platforms.push(createPlatform(-4, 22, -40, 4, 1, 4, 0, 15));
platforms.push(createPlatform(2, 22, -40, 4, 1, 4, 0, -15));
platforms.push(createPlatform(8, 21, -40, 8, 1, 1, 0, 0));
platforms.push(createPlatform(16, 21, -40, 8, 1, 0.5, 0, 0));
platforms.push(createPlatform(23, 21, -40, 6, 1, 6, 0, 0));

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let textures = [];
function addTexture(fileName) {
  const redGiftTexture = new THREE.TextureLoader().load(
    "./textures/" + fileName
  );
  textures.push(redGiftTexture);
}
addTexture("gift_red.avif");
addTexture("gift_yellow.avif");
addTexture("gift_cyan.jpg");
addTexture("gift_white.jpg");
addTexture("gift_purple.jpg");

//Points
function createPoint(x, y, z) {
  let random = getRandomInt(textures.length);
  let selectedTexture = textures[random];
  console.log(random);
  const point = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
      map: selectedTexture,
    })
  );
  scene.add(point);
  point.position.x = x;
  point.position.y = y;
  point.position.z = z;

  return point;
}
let points = [];
points.push(createPoint(0, 7, 36));
points.push(createPoint(-20, 7, 26));
points.push(createPoint(-38, 9, -7));
points.push(createPoint(-39, 17, -42));
points.push(createPoint(-1, 26, -40));

function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomBetweenWithout(min, max, withoutMin, withoutMax) {
  let random = Math.random() * (max - min) + min;
  while (random > withoutMin && random < withoutMax) {
    random = Math.random() * (max - min) + min;
  }
  return random;
}

function createChristmasTreeBaubles(
  xRange,
  yRange,
  zRange,
  yPosition,
  group,
  times,
  christmassTreeBaublesLocations
) {
  for (let i = 0; i < times; i++) {
    let randomColor = Math.random() * 0xffffff;
    const bauble = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshStandardMaterial({
        color: randomColor,
      })
    );
    let randomX = getRandomBetweenWithout(
      -xRange,
      xRange,
      -xRange / 2,
      xRange / 2
    );
    let randomY = Math.random() * yRange + yPosition;
    let randomZ = getRandomBetweenWithout(
      -zRange,
      zRange,
      -zRange / 2,
      zRange / 2
    );

    let boubleVector = new THREE.Vector3(randomX, randomY, randomZ);
    let i = 0;

    while (
      checkDistance(boubleVector, 1, christmassTreeBaublesLocations) &&
      i < 100
    ) {
      boubleVector = new THREE.Vector3(
        getRandomBetweenWithout(-xRange, xRange, -xRange / 2, xRange / 2),
        Math.random() * yRange + yPosition,
        getRandomBetweenWithout(-zRange, zRange, -zRange / 2, zRange / 2)
      );
      console.log("Rol");
      i++;
    }

    // console.log("randomX: " + randomX);
    bauble.position.x = randomX;
    bauble.position.y = randomY;
    bauble.position.z = randomZ;
    group.add(bauble);
  }
}

function createChristmassTree(x, y, z) {
  const decorations = new THREE.Group();

  let christmassTreeBaublesLocations = [];

  createChristmasTreeBaubles(
    2.4,
    0.6,
    2.4,
    1,
    decorations,
    4,
    christmassTreeBaublesLocations
  );
  createChristmasTreeBaubles(
    1.8,
    0.6,
    1.9,
    2.7,
    decorations,
    3,
    christmassTreeBaublesLocations
  );
  createChristmasTreeBaubles(
    0.8,
    0.6,
    0.8,
    4,
    decorations,
    2,
    christmassTreeBaublesLocations
  );

  const top = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffff00,
      //   map: selectedTexture,
    })
  );

  top.position.x = x;
  top.position.y = y + 5;
  top.position.z = z;
  scene.add(top);

  const tree = new THREE.Group();

  const log = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 3, 30),
    new THREE.MeshStandardMaterial({
      color: 0x772200,
      //   map: selectedTexture,
    })
  );
  tree.add(log);

  let leavesColor = new THREE.Color().setRGB(
    getRandomBetween(0.0, 0.1),
    getRandomBetween(0.25, 0.7),
    getRandomBetween(0.0, 0.1)
  );
  const leaves1 = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 2.5, 20, 20),
    new THREE.MeshStandardMaterial({
      color: leavesColor,
    })
  );
  leaves1.position.y = 2;

  const leaves2 = new THREE.Mesh(
    new THREE.ConeGeometry(2.5, 2, 20, 20),
    new THREE.MeshStandardMaterial({
      color: leavesColor,
    })
  );
  leaves2.position.y = 3.5;

  const leaves3 = new THREE.Mesh(
    new THREE.ConeGeometry(1.5, 1, 20, 20),
    new THREE.MeshStandardMaterial({
      color: leavesColor,
    })
  );
  leaves3.position.y = 4.5;

  decorations.position.x = x;
  decorations.position.y = y;
  decorations.position.z = z;
  tree.add(leaves1);
  tree.add(leaves2);
  tree.add(leaves3);
  tree.position.x = x;
  tree.position.y = y;
  tree.position.z = z;
  scene.add(decorations);
  scene.add(tree);
}

// createChristmassTree(0, 8, 36);

function getRandomInt2(min, ammount) {
  return Math.floor(Math.random() * ammount + min);
}

let christmassTreeLocations = [];

function checkDistance(vector, minDistance, checkedValues) {
  for (let i = 0; i < checkedValues.length; i++) {
    if (vector.distanceTo(checkedValues[i]) <= minDistance) {
      return true;
    }
  }
  checkedValues.push(vector);
  return false;
}

for (let i = 0; i < 100; i++) {
  const min = -100;
  const max = 200;
  let randomVector = new THREE.Vector3(
    getRandomInt2(min, max),
    0,
    getRandomInt2(min, max)
  );
  let i = 0;

  while (checkDistance(randomVector, 15, christmassTreeLocations) && i < 100) {
    randomVector = new THREE.Vector3(
      getRandomInt2(min, max),
      0,
      getRandomInt2(min, max)
    );
    i++;
  }

  createChristmassTree(randomVector.x, randomVector.y, randomVector.z);
}

const metaBox = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial({
    //   color: randomColor,
    map: new THREE.TextureLoader().load("./textures/meta.png"),
  })
);
metaBox.position.set(25, 23, -40);
scene.add(metaBox);

//Player
const life = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 3, 30),
  new THREE.MeshStandardMaterial({
    color: 0x99ff99,
  })
);
life.castShadow = true;
scene.add(life);

const lifeBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Cylinder(1, 1, 3, 30),
});
world.addBody(lifeBody);

lifeBody.position.z = 38;
lifeBody.position.y = 5;

//Kamera
camera.position.z = 42;
camera.position.y = 2;

//Light
const directionalLight = new THREE.DirectionalLight(0xaaffaa, 0.6);
// directionalLight.position.z = 20;
directionalLight.position.y = 20;
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

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

//Movement
document.addEventListener("keydown", (event) => {
  if (event.key in keys) keys[event.key] = true;
});

//End of Movement
document.addEventListener("keyup", (event) => {
  if (event.key in keys) keys[event.key] = false;
});

// Create a player (visual object)
const player = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32), // Radius 1 sphere
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/" + "santa_head.jpg"),
    // color: 0x00ff00,
  })
);
player.castShadow = true;
scene.add(player);

// Create a physics body for the player
const playerBody = new CANNON.Body({
  mass: 3,
  shape: new CANNON.Sphere(1),
});
world.addBody(playerBody);
// playerBody.position.x = 5;
playerBody.position.y = 10;
playerBody.position.z = 42;

const cameraOffset = new THREE.Vector3(0, 5, -10); // 5 units up, 10 units behind

function updateCamera() {
  if (playerBody.position.y < 2) {
    playerBody.position.x = 0;
    playerBody.position.y = 10;
    playerBody.position.z = 42;

    playerBody.velocity.set(0, 0, 0);
    falls++;
    updateScore();
  }

  // Get the player's forward direction from its velocity
  const playerVelocity = new THREE.Vector3(
    playerBody.velocity.x,
    playerBody.velocity.y,
    // 0, // Ignore Y velocity for forward direction
    playerBody.velocity.z
  );

  // Normalize the velocity to get the direction
  if (playerVelocity.length() > 0.01) {
    playerVelocity.normalize();
  } else {
    // If the ball is stationary, keep the camera in its current position
    playerVelocity.set(0, 0, -1); // Default to facing along the Z-axis
  }

  // Define the camera's offset relative to the ball
  const cameraOffset = new THREE.Vector3()
    .copy(playerVelocity)
    .multiplyScalar(-10) // 10 units behind the ball based on movement direction
    .add(new THREE.Vector3(0, 5, 0)); // 5 units above the ball

  //   Set the camera's position
  const targetPosition = new THREE.Vector3()
    .copy(playerBody.position)
    .add(cameraOffset);

  // Smoothly interpolate the camera position
  camera.position.lerp(targetPosition, 0.05); // Adjust 0.1 for smoother motion

  // Make the camera look at the ball
  let targetPositionCords = playerBody.position;
  camera.lookAt(
    targetPositionCords.x,
    targetPositionCords.y,
    targetPositionCords.z
  );
}

function calculateDistance(object1, object2) {
  const dx = object2.position.x - object1.position.x;
  const dy = object2.position.y - object1.position.y;
  const dz = object2.position.z - object1.position.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

let score = 0;
let falls = 0;
function updateScore() {
  //   score = newScore;
  document.getElementById("points").textContent = `${score}`;
  document.getElementById("falls").textContent = `${falls}`;
}
updateScore();

const particleCount = 10000;
const particles = new THREE.BufferGeometry();
const positions = [];
const velocities = [];

for (let i = 0; i < particleCount; i++) {
  const x = (Math.random() - 0.5) * 150;
  const y = Math.random() * 65;
  const z = (Math.random() - 0.5) * 150;

  positions.push(x, y, z);
  velocities.push(0, -Math.random() * 0.01 - 0.01, 0);
}

particles.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

// Material
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1,
  transparent: true,
  opacity: 0.8,
});

// Create Points
const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

let haveWon = false;
function animate() {
  world.step(timeStep);
  if (haveWon) {
    return;
  }

  const positions = particles.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += velocities[Math.floor(i / 3) * 3 + 1]; // Y-axis velocity

    // Reset to top when reaching the bottom
    if (positions[i + 1] < -25) {
      positions[i + 1] = 25;
    }
  }

  particles.attributes.position.needsUpdate = true;

  grass.position.copy(grassBody.position);
  grass.quaternion.copy(grassBody.quaternion);

  life.position.copy(lifeBody.position);
  life.quaternion.copy(lifeBody.quaternion);

  player.position.copy(playerBody.position);
  player.quaternion.copy(playerBody.quaternion);

  platforms.forEach((e) => {
    e[0].position.copy(e[1].position);
    e[0].quaternion.copy(e[1].quaternion);
  });

  points.forEach((e, i) => {
    let distance = calculateDistance(e, player);
    if (distance < 2) {
      scene.remove(e);
      score++;
      updateScore();
      points.splice(i, 1);
    }
  });

  if (!haveWon) {
    let distanceFromEnd = calculateDistance(metaBox, player);
    if (distanceFromEnd < 1 && score >= 5) {
      haveWon = true;
      document.getElementById("wygrana").classList.remove("hidden");
      // scene.remove(e);
      // score++;
      // updateScore();
      // points.splice(i, 1);
    }
  }

  updateCamera();

  //   camera.position.copy(playerBody.position);
  //   camera.quaternion.copy(playerBody.quaternion);

  let force = 0.2;
  playerBody.linearDamping = 0.7;

  // Get the forward and right vectors from the camera
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward); // Forward vector (where the camera is looking)

  // Calculate the right vector as the cross product of forward and the world-up vector (0, 1, 0)
  const right = new THREE.Vector3();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  // Flatten the forward vector to prevent vertical movement
  forward.y = 0;
  forward.normalize();

  // Movement logic
  const movement = new THREE.Vector3();
  if (keys.w) movement.add(forward.clone().multiplyScalar(force)); // Move forward
  if (keys.s) movement.add(forward.clone().multiplyScalar(-force)); // Move backward
  if (keys.a) movement.add(right.clone().multiplyScalar(-force)); // Move left
  if (keys.d) movement.add(right.clone().multiplyScalar(force)); // Move right

  // Apply the calculated movement to the player's velocity
  playerBody.velocity.x += movement.x;
  playerBody.velocity.z += movement.z;

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
