import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Text } from 'troika-three-text';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const canvas = document.querySelector(".app");      //canvas
const width = canvas.clientWidth;
const height = canvas.clientHeight;

const scene = new THREE.Scene();        //scene

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);    //camera

// light 
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const orbitControls = new OrbitControls(camera, canvas);   //controls


// Create Text
const myText = new Text()
myText.text = 'charging Pin'
myText.fontSize = 0.2
myText.position.z = 0
myText.position.y = 1
myText.color = 0x9966FF
myText.sync()
scene.add(myText);

const renderer = new THREE.WebGLRenderer({ canvas });     //renderer
renderer.setSize(width, height);

// create an AxesHelper instance with a size of 5
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// loader
let loader = new GLTFLoader();
let arduino;
loader.load('public/arduino.gltf', function (gltf) {
    scene.add(gltf.scene);
    arduino = gltf.scene;
    gltf.scene.position.set(1, 0, 1);
    gltf.scene.scale.set(0.05, 0.05, 0.05);

    const mesh1 = gltf.scene.children[8];
    mesh1.position.x += 10;
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.material.metalness = 0.5;
            child.material.roughness = 0.5;
        }
    });
});

// //creating the cube
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

//create a blue LineBasicMaterial
const line_material = new THREE.LineBasicMaterial({ color: 0x0000ff });
const points = [];
points.push(new THREE.Vector3(- 10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const line_geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(line_geometry, line_material);
scene.add(line);



camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.1;
    // cube.rotation.y += 0.01;
    if (arduino) {
        arduino.rotation.y += 0.01;
        // arduino.rotation.x += 0.01;
    }
    orbitControls.update();

    renderer.render(scene, camera);
}

animate();