import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//create box
const getBox = (w, h, d) => {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshBasicMaterial(
        {
            color: 0x00ff00,
        }
    );
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

//create sphere
const getShpere = (size) => {
    var geometry = new THREE.SphereGeometry(size, 50, 50);
    var material = new THREE.MeshBasicMaterial(
        {
            color: 0x0000ff,
            wireframe: false,

        }
    );
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

//create cone
const getCone = (size) => {
    var geometry = new THREE.ConeGeometry(size, size, 50);
    var material = new THREE.MeshBasicMaterial(
        {
            color: 'yellow',
            wireframe: false,

        }
    );
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

//create plane
const getPlane =(size) => {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshBasicMaterial(
        {
            color: 0xFFFFFF,
            side: THREE.DoubleSide            
        }
    );
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}


const init = () => {
    //create renderer
    const renderer = new THREE.WebGLRenderer();   
    renderer.setSize(window.innerWidth/1, window.innerHeight/1.25   );
    document.getElementById('webgl').appendChild(renderer.domElement);

    //create scene
    var scene = new THREE.Scene();

    //create camera
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    //orbit controls
    const orbit = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 2, 5);
    orbit.update();


    //add box
    var box = getBox(1, 1, 1);
    box.position.y = box.geometry.parameters.height / 2;
    scene.add(box);

    
    //add sphere
    var sphere = getShpere(0.5);
    sphere.position.set(2,sphere.geometry.parameters.radius,2)
    scene.add(sphere);

    //add cone
    var cone = getCone(0.5);
    cone.position.set(-1, cone.geometry.parameters.radius, 2);
    scene.add(cone);

    //add plane
    var plane = getPlane(5);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    //add gridHelper
    const gridHelper = new THREE.GridHelper(5);
    scene.add(gridHelper);

    scene.background = new THREE.Color('gray');

    const animate = () => { 
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);
}

init()