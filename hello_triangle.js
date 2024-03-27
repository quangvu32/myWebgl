import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Create a scene
const scene = new THREE.Scene();


// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(1,2,5);
orbit.update();

//add Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

//add plane
const planeGeometry = new THREE.PlaneGeometry(30,30)
const planeMaterial = new THREE.MeshStandardMaterial(
  {
    color:0xFFFFFF, 
    side: THREE.DoubleSide
  })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -Math.PI * 0.5

//add gridHelper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

//add Sphere
const sphereGeometry = new THREE.SphereGeometry(4,50,50)
const sphereMaterial = new THREE.MeshStandardMaterial({color:0x000FF, wireframe: false})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10,10,0)
sphere.castShadow = true

//Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
scene.add(directionalLight)

//Ambient Light
const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)


//gui options
const gui = new dat.GUI()
const options = {
  sphereColor: '#f234d2',
  sphereWireFrame: false,
  speed: 0.01
}

gui.addColor(options, 'sphereColor').onChange(
  (color) => {
    sphere.material.color.set(color)
  }
)
gui.add(options, 'sphereWireFrame').onChange(
  (wireframe) => {
    sphere.material.wireframe = wireframe
  }
)
gui.add(options, 'speed',0,0.1)


//Animation looping
let step = 0;
const animate = () => {
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  step+= options.speed
  sphere.position.y = 10 * Math.abs(Math.sin(step))
  renderer.render(scene, camera);

}
renderer.setAnimationLoop(animate);

renderer.render(scene, camera);
