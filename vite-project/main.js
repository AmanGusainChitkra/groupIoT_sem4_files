import * as THREE from 'three';

//scene
const scene = new THREE.Scene();
console.log(typeof(scene));

//Create a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: "#00ff83",
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);