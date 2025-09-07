import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

// 粒子背景
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 1000;
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 10;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0x00ffcc });
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// 技能数据
const skills = [
  { name: 'JavaScript', desc: 'Dynamic web development', texture: 'assets/js.png', position: [-2, 1, 0] },
  { name: 'Rust', desc: 'High-performance programming', texture: 'assets/rust.png', position: [0, 1, 0] },
  { name: 'Python', desc: 'Data science & automation', texture: 'assets/python.png', position: [2, 1, 0] },
  { name: 'Three.js', desc: '3D web visualizations', texture: 'assets/threejs.png', position: [-1, -1, 0] },
];

// 创建技能卡片
const skillMeshes = [];
skills.forEach(skill => {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const texture = new THREE.TextureLoader().load(skill.texture);
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...skill.position);
  mesh.userData = skill;
  scene.add(mesh);
  skillMeshes.push(mesh);
});

// 交互
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(skillMeshes);
  if (intersects.length > 0) {
    const skill = intersects[0].object.userData;
    document.getElementById('skill-name').textContent = skill.name;
    document.getElementById('skill-desc').textContent = skill.desc;
  }
});

// 动画
function animate() {
  requestAnimationFrame(animate);
  skillMeshes.forEach(mesh => {
    mesh.rotation.y += 0.01;
  });
  particles.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();

// 响应式
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
