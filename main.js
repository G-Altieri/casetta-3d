import './style.css';
//import lax from 'lax.js'
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
//import { GLTFLoader } from 'three/examples/jsm/loader/GLTFLoader.js';
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';
import {
    MTLLoader
} from 'three/examples/jsm/loaders/MTLLoader.js';

/*
//Import assets
import casettaMlt from '/assets/model/fake-casetta-obg/fakecasetta.mtl?raw';
import casettaObj from '/assets/model/fake-casetta-obg/fakecasetta.obj?raw';
import grassMlt from '/assets/model/grass/grass.mtl?raw';
import grassObj from '/assets/model/grass/grass.obj?raw';
import bgAssets from '/assets/img/bg.jpg?raw';

*/

var casettaMlt = '/model/fake-casetta-obg/fakecasetta.mtl';
var casettaObj = '/model/fake-casetta-obg/fakecasetta.obj';
var grassMlt = '/model/grass/grass.mtl';
var grassObj = 'model/grass/grass.obj';
var bgAssets = '/img/bg.jpg';

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
camera.position.setZ(100);
camera.position.setX(0);
camera.position.setY(15);

//Render Resize the windows 
window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    //console.log("Resize");
})
renderer.render(scene, camera);


// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 30, 0);
const lightHelper2 = new THREE.PointLightHelper(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff);
pointLight2.position.set(0, 50, -20);
const lightHelper3 = new THREE.PointLightHelper(pointLight2);

const ambientLight = new THREE.AmbientLight(0x404040);
ambientLight.intensity = 4;
const lightHelper = new THREE.PointLightHelper(ambientLight);

scene.add(pointLight, pointLight2, ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, lightHelper2, lightHelper3, gridHelper);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

//bg
const bg = new THREE.TextureLoader().load(bgAssets);
scene.background = bg;


//Loading Model
const objLoader = new OBJLoader()
const objLoader2 = new OBJLoader()
const mtlLoader = new MTLLoader()
const mtlLoader2 = new MTLLoader()


//Casetta
mtlLoader.load(
    casettaMlt,
    (materials) => {
        materials.preload()
        objLoader.setMaterials(materials)
        objLoader.load(
            casettaObj,
            (object) => {
                casetta(object)
                scene.add(object)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded obj Casetta')
            },
            (error) => {
                console.log('An error happened')
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded mtl Casetta')
    },
    (error) => {
        console.log('An error happened2')
    }
)

//Grass
mtlLoader2.load(
    grassMlt,
    (materials) => {
        materials.preload()
        objLoader2.setMaterials(materials)
        objLoader2.load(
            grassObj,
            (object) => {
                grass(object)
                scene.add(object);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded obj Grass')
            },
            (error) => {
                console.log('An error happened')
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded mtl Grass')
    },
    (error) => {
        console.log('An error happened2')
    }
)


function casetta(object) {
    object.position.y = 8;
}

function grass(object) {
    object.rotation.x = 300;
}


var angle = 0;
var radius = 100;
// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    //Movement
    //camera.position.setX(x += 0.1 * Math.sin(1));

    camera.position.x = radius * Math.cos(angle);
    camera.position.z = radius * Math.sin(angle);
    angle += 0.003;



    controls.update();

    renderer.render(scene, camera);
}

animate();



/*
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    casetta2.rotation.x += 0.01 * Math.sin(1)
    casetta2.rotation.y += 0.01 * Math.sin(1)
    casetta2.rotation.z += 0.01 * Math.sin(1)

    // Update controls
    controls.update()
        // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
*/


/* 
//BUTTON
  document.getElementById("myBtn").addEventListener("click", function() {
      Knife2.rotation.z = -300;
      setTimeout(() => {
          Knife2.rotation.y = -100;
  
      }, 1000);
  });
  */
/* //SCROOL LIBRARY
window.onload = function() {
        lax.init()

        // Add a driver that we use to control our animations
        lax.addDriver('scrollY', function() {
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
    }*/


/*
//Geometry
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
//const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//const material = new THREE.MeshStandardMaterial({ color: 0xffff0, wireframe:false});
const material = new THREE.MeshNormalMaterial({
    color: 0xffff0,
    wireframe: false
});
const torus = new THREE.Mesh(geometry, material);

//scene.add(torus);
*/