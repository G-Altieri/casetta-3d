import './style.css';
import lax from 'lax.js'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import { GLTFLoader } from 'three/examples/jsm/loader/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
// Setup
const scene = new THREE.Scene();


//camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 5000);

//renders
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

//Render Resize the windows 
window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    //console.log("Resize");
})
renderer.render(scene, camera);

//Geometry
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
//const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//const material = new THREE.MeshStandardMaterial({ color: 0xffff0, wireframe:false});
const material = new THREE.MeshNormalMaterial({ color: 0xffff0, wireframe: false });
const torus = new THREE.Mesh(geometry, material);

//scene.add(torus);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 30, 20);
const lightHelper2 = new THREE.PointLightHelper(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff);
pointLight2.position.set(0, 0, -20);
const lightHelper3 = new THREE.PointLightHelper(pointLight2);

const ambientLight = new THREE.AmbientLight(0x404040);
ambientLight.intensity = 0.8;
const lightHelper = new THREE.PointLightHelper(ambientLight);

scene.add(pointLight,pointLight2, ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, lightHelper2,lightHelper3);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;

//bg
const bg = new THREE.TextureLoader().load('/assets/img/bg.jpg');
//scene.background = bg;


// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    //Movement
    torus.rotation.x += 0.005;
    //  torus.rotation.y += 0.005;
    torus.rotation.z += 0.005;

    controls.update();

    renderer.render(scene, camera);
}

animate();


//GLTFLoader
// instantiate a loader Objects
const loader = new OBJLoader();
var Knife2;
// load a resource
loader.load(
    // resource URL
    '/assets/model/Knife_obj/Knife_obj.obj',
    // called when resource is loaded
    function (object) {
        scene.add(object);
        Knife2=object;
        Knife(object);
        console.log("Caricato");
    },
    // called when loading is in progresses
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
        console.log('An error happened');
    }
);



function Knife(object){
    object.rotation.x =-24;
}


document.getElementById("myBtn").addEventListener("click", function() {
    Knife2.rotation.z =-300;
    setTimeout(()=>{
        Knife2.rotation.y =-100;

    }, 1000);
});

window.onload = function () {
    lax.init()

    // Add a driver that we use to control our animations
    lax.addDriver('scrollY', function () {
      return window.scrollY
    })

    // Add animation bindings to elements
    lax.addElements('.button5', {
      scrollY: {
        translateX: [
          ["elInY", "elCenterY", "elOutY"],
          [0, 'screenWidth/2', 'screenWidth'],
        ]
      }
    })
  }
/*
const mtlLoader = new MTLLoader()
mtlLoader.load(
    '/assets/model/Knife_obj/Knife_obj.mtl',
    (materials) => {
        materials.preload()

        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)
        objLoader.load(
            '/assets/model/Knife_obj/Knife_obj.obj',
            (object) => {
                scene.add(object)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log('An error happened')
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log('An error happened')
    }
)*/



  /**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //mesh.rotation.x += 0.01 * Math.sin(1)
  //mesh.rotation.y += 0.01 * Math.sin(1)
  //mesh.rotation.z += 0.01 * Math.sin(1)

  // Update controls
  controls.update()
  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}