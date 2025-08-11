import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

let scene, camera, renderer, flashlight;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const loader = new THREE.TextureLoader();

init();
animate();

function init() {
    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 10, 50);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 0);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 4. Pencahayaan - Senter (Flashlight)
    flashlight = new THREE.SpotLight(0xffffff, 2, 20, Math.PI / 8, 0.5, 2);
    flashlight.position.set(0, 0, 0);
    camera.add(flashlight);
    scene.add(camera);

    // 5. Tambahkan Lingkungan (Ruangan Kotak)
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const wallGeometry = new THREE.BoxGeometry(50, 50, 0.1);

    const wallTexture = loader.load('https://threejs.org/examples/textures/brick_diffuse.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(10, 10);

    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

    // Lantai
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Dinding
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(0, 25, -25);
    scene.add(wall1);

    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.set(0, 25, 25);
    wall2.rotation.y = Math.PI;
    scene.add(wall2);

    const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall3.position.set(-25, 25, 0);
    wall3.rotation.y = Math.PI / 2;
    scene.add(wall3);

    const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall4.position.set(25, 25, 0);
    wall4.rotation.y = -Math.PI / 2;
    scene.add(wall4);
    
    // Langit-langit
    const ceiling = new THREE.Mesh(floorGeometry, floorMaterial);
    ceiling.position.set(0, 50, 0);
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // 6. Kontrol Gerakan Keyboard
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // 7. Kontrol Mouse untuk Lihat Sekeliling
    document.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.mozRequestPointerLock;
    document.addEventListener('click', () => renderer.domElement.requestPointerLock());

    window.addEventListener('resize', onWindowResize, false);
}

function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = true;
            break;
        case 'KeyA':
            moveLeft = true;
            break;
        case 'KeyS':
            moveBackward = true;
            break;
        case 'KeyD':
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = false;
            break;
        case 'KeyA':
            moveLeft = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;
        case 'KeyD':
            moveRight = false;
            break;
    }
}

function onMouseMove(event) {
    if (document.pointerLockElement === renderer.domElement || document.mozPointerLockElement === renderer.domElement) {
        const movementX = event.movementX || event.mozMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || 0;

        camera.rotation.y -= movementX * 0.002;

        camera.rotation.x -= movementY * 0.002;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    const moveSpeed = 5.0;

    velocity.x = 0;
    velocity.z = 0;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) {
        velocity.z -= direction.z * moveSpeed * delta;
    }
    if (moveLeft || moveRight) {
        velocity.x -= direction.x * moveSpeed * delta;
    }

    camera.translateZ(velocity.z);
    camera.translateX(velocity.x);

    prevTime = time;

    renderer.render(scene, camera);
}
