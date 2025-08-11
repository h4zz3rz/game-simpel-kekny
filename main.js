import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

// 1. Buat Scene, Camera, dan Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Tambahkan Pencahayaan Atmosfer Horor
// Hapus pencahayaan default. Gunakan sumber cahaya yang terbatas seperti senter.
const ambientLight = new THREE.AmbientLight(0x404040); // Cahaya redup
scene.add(ambientLight);

const flashlight = new THREE.SpotLight(0xffffff, 1.5, 50, Math.PI / 4, 0.5, 2);
flashlight.position.set(0, 5, 0); // Atur posisi senter
scene.add(flashlight);
camera.add(flashlight); // Senter akan mengikuti kamera
scene.add(camera); // Tambahkan kamera ke scene setelah menambahkan senter

// 3. Muat Lingkungan Game (Model 3D Ruangan)
const loader = new THREE.GLTFLoader();
loader.load('path/to/your/haunted_room.glb', (gltf) => {
  scene.add(gltf.scene);
});

// 4. Implementasikan Gerakan Pemain (FPS)
// Gunakan event listener untuk mouse dan keyboard untuk mengontrol kamera dan gerakan pemain.
// Rotasi kamera (mouse-look)
document.addEventListener('mousemove', (event) => {
  // Update rotasi kamera berdasarkan event.movementX dan event.movementY
});

// Pergerakan (W, A, S, D)
document.addEventListener('keydown', (event) => {
  // Update posisi kamera berdasarkan tombol yang ditekan
});

// 5. Tambahkan Logika Gameplay
// - Deteksi Tabrakan: Gunakan Raycaster untuk mencegah pemain menembus dinding.
// - Objek Interaktif: Cek saat pemain mendekati pintu atau item.
// - AI Musuh (Jump Scare): Gerakkan model monster dengan script dan buat jump scare saat pemain mendekat.

// 6. Loop Animasi Utama (Render Loop)
function animate() {
  requestAnimationFrame(animate);
  // Logika game di sini (misalnya, update posisi senter, AI monster)
  
  renderer.render(scene, camera);
}
animate();
