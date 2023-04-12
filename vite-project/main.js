import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Text } from 'troika-three-text';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import * as TWEEN from 'tween/tween.js';

const canvas = document.querySelector(".app");      //canvas
const width = canvas.clientWidth;
const height = canvas.clientHeight;

const scene = new THREE.Scene();        //scene

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);    //camera

//Setting objects to be dragged
var objects = [];

// light 
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);





// controls

const eventDispatcher = new THREE.EventDispatcher();
const orbitControls = new OrbitControls(camera, canvas);    //orbit Controls
orbitControls.addEventListener('change', () => {
    eventDispatcher.dispatchEvent({ type: 'change' });
    // camera.lookAt(dragControls.target);
})

var dragControls = new DragControls(objects, camera, canvas);   //drag Controls
dragControls.addEventListener('dragstart', () => {
    orbitControls.enabled = false;
})
dragControls.addEventListener('dragend', () => {
    orbitControls.enabled = true;
    eventDispatcher.dispatchEvent({ type: 'change' });
})
dragControls.addEventListener('drag', function (event) {
    event.object.position.copy(event.position);
});




// Create Text
const myText = new Text()
myText.text = 'charging Pin'
myText.fontSize = 0.2
myText.position.z = 0
myText.position.y = 1
myText.color = 0x9966FF
myText.sync()
scene.add(myText);

//renderer
const renderer = new THREE.WebGLRenderer({ canvas });
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
    arduino.position.set(1, 0, 1);
    arduino.scale.set(0.05, 0.05, 0.05);
    arduino.rotation.x += 0.6;

    const mesh1 = arduino.children[27];
    mesh1.position.y += 4;

    //geting names
    var group = arduino;
    group.traverse(function (child) {
        if (child.isMesh) {
            console.log(child.name); // Print the name of the mesh
        }
    });

    // Traverse the scene graph to find the object by name
    scene.traverse(function (child) {
        if (child.name === 'Body120') {
            objects.push(child);
        }
    });

    for (let i = 0; i < 20; i++) {
        arduino.children[i].position.y += (i + 2);
        arduino.children[i].position.x += (i + 2);
        objects.push(arduino.children[i]);
    }

    // arduino.traverse((child) => {
    //     if (child.isMesh) {
    //         child.material.metalness = 0.5;
    //         child.material.roughness = 0.5;
    //     }
    // });
});




//adding event listners for buttons
const homeB = document.querySelector('.homeB');
homeB.addEventListener('click', () => {
    resetCameraPosition();
});
function resetCameraPosition() {
    
        const target = new THREE.Vector3(0, 0, 10); // Set the target position to the origin
        const startPosition = new THREE.Vector3().copy(camera.position); // Get the current position of the camera
        const distance = target.distanceTo(startPosition); // Get the distance between the target position and the current position of the camera
        const duration = 1000; // Set the duration of the rotation in milliseconds
    
        new TWEEN.Tween(camera.position)
            .to({ x: target.x, y: target.y, z: target.z }, duration)
            .onUpdate(() => {

            })
            .start();
    
        new TWEEN.Tween(camera.rotation)
            .to({ x: 0, y: 0, z: 0 }, duration) // Rotate the camera to look at the target
            .start();
  }
  
  



//***************************This is adjustements section********************* */

//adjustements
camera.position.z = 9;

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();

    // if (arduino) {                       //rotating animation
    //     arduino.rotation.y += 0.01;
    //     // arduino.rotation.x += 0.01;
    // }
    // orbitControls.update();

    renderer.render(scene, camera);
}

animate();