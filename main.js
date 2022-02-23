import './style.css';
//import lax from 'lax.js'
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';
import {
    MTLLoader
} from 'three/examples/jsm/loaders/MTLLoader.js';
import {
    TextGeometry
} from 'three/examples/jsm/geometries/TextGeometry.js'
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'
import {
    LoadingManager
} from 'three';
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';
import {
    GUI
} from 'dat.gui';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';


var casettaGLTF = '/model/casetta glb/casetta.glb';
var gekoGLTF = '/model/geko/scene.gltf';
var casettaMlt = '/model/fake-casetta-obg/fakecasetta.mtl';
var casettaObj = '/model/fake-casetta-obg/fakecasetta.obj';
var grassMlt = '/model/grass/grass.mtl';
var grassObj = 'model/grass/grass.obj';
var bgAssets = '/img/bg.hdr';


// Setup
const scene = new THREE.Scene();
var clock = new THREE.Clock();
var mixer
    //camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.setZ(50);
camera.position.setX(50);
camera.position.setY(12);


//renders
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});


// Lights
const pointLight1 = new THREE.PointLight(0xffffff);
const lightHelper1 = new THREE.PointLightHelper(pointLight1);
pointLight1.position.set(100, 50, 100);
pointLight1.intensity = 1;

const pointLight2 = new THREE.PointLight(0xffffff);
const lightHelper2 = new THREE.PointLightHelper(pointLight2);
pointLight2.position.set(-100, 13, -100);
pointLight2.intensity = 0.25;

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.05;
const ambientHelper = new THREE.PointLightHelper(ambientLight);

scene.add(ambientLight, pointLight1, pointLight2);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper1, ambientHelper, gridHelper, lightHelper2);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;


//Loading Screen
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000),
    box: new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0., 5), new THREE.MeshBasicMaterial({
        color: 0x4444ff
    }))
};
var resourse_loaded = true;
loadingScreen.box.position.set(0, 0, 5);
loadingScreen.camera.lookAt(loadingScreen.box.position)
loadingScreen.scene.add(loadingScreen.box)


//Loading Manager
const loadingManager = new THREE.LoadingManager();
//loadingManager.onProgress = function(item, loaded, total) { console.log(item, loaded, total) }
loadingManager.onLoad = function() {
    resourse_loaded = false;
    var element = document.getElementById("load");
    element.classList.add("hidden");
    console.log("Risorse Caricate");
}

//BackGround
//const bg = new THREE.TextureLoader().load(bgAssets);
new RGBELoader(loadingManager)
    .load(bgAssets, function(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
        render();
    });


//Animation Casetta



//Loading Model
const objLoader = new OBJLoader(loadingManager)
const objLoader2 = new OBJLoader(loadingManager)
const mtlLoader = new MTLLoader(loadingManager)
const mtlLoader2 = new MTLLoader(loadingManager)
const loaderCasetta = new GLTFLoader(loadingManager);

var casettaModel;
var gekoModel;
var scaleGeko = 1;
mtlLoader2.load(
    //Grass
    grassMlt,
    (materialGrass) => {
        materialGrass.preload()
        objLoader2.setMaterials(materialGrass)
        objLoader2.load(
            grassObj,
            (grass) => {
                grass.rotation.x = 300;
                scene.add(grass);
                //Casetta
                loaderCasetta.load(casettaGLTF, function(gltf) {
                    casettaModel = gltf;
                    casettaModel.scene.position.x = -37;
                    casettaModel.scene.position.y = 5;
                    casettaModel.scene.position.z = 30;

                    animationCasetta(casettaModel);
                    scene.add(casettaModel.scene);

                    //Geko
                    loaderCasetta.load(gekoGLTF, function(gltf) {
                        gekoModel = gltf;
                        geko()
                        gekoModel.scene.children[0].scale.set(gekoModel.scene.children[0].scale.x * scaleGeko, gekoModel.scene.children[0].scale.y * scaleGeko, gekoModel.scene.children[0].scale.z * scaleGeko)
                        scene.add(gekoModel.scene);
                        console.log(gekoModel.scene.children[0].scale)
                        init()
                    });
                });

            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded obj Grass')
            },
            (error) => {
                console.log('An error happened Grass ' + error)
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded mtl Grass')
    },
    (error) => {
        console.log('An error happened2 Grass')
    }
)

function animationCasetta(gltf) {
    mixer = new THREE.AnimationMixer(casettaModel.scene);
    casettaModel.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
}

function geko() {
    gekoModel.scene.position.x = -2;
    gekoModel.scene.position.y = 15.6;
    gekoModel.scene.position.z = -6;
    gekoModel.scene.rotation.x = 14;
    gekoModel.scene.rotation.y = 18;
    gekoModel.scene.rotation.z = 3;

}

function casetta(object) {
    object.position.y = 8;
}

function grass(object) {
    object.rotation.x = 300;
}



renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
renderer.outputEncoding = THREE.sRGBEncoding;

//Render Resize the windows 
window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    //console.log("Resize");
})

function init() {
    //GUI Dev
    const gui = new GUI()
    const light1Folder = gui.addFolder('Light 1')
    light1Folder.add(pointLight1.position, 'x', 0, 100)
    light1Folder.add(pointLight1.position, 'y', 0, 100)
    light1Folder.add(pointLight1.position, 'z', 0, 100)
    light1Folder.add(pointLight1, 'intensity', 0, 2, 0.01);
    //light1Folder.open()
    const light2Folder = gui.addFolder('Light 2')
    light2Folder.add(pointLight2.position, 'x', -100, 100)
    light2Folder.add(pointLight2.position, 'y', -100, 100)
    light2Folder.add(pointLight2.position, 'z', -100, 100)
    light2Folder.add(pointLight2, 'intensity', 0, 2, 0.01);
    //light2Folder.open()
    const cameraFolder = gui.addFolder('Camera')
    cameraFolder.add(camera.position, 'z', 0, 200)
    cameraFolder.add(camera.position, 'x', 0, 200)
    cameraFolder.add(camera.position, 'y', 0, 200)
        //cameraFolder.open()
    const casettaFolder = gui.addFolder('Casetta')
    casettaFolder.add(casettaModel.scene.position, 'z', -200, 200)
    casettaFolder.add(casettaModel.scene.position, 'x', -200, 200)
    casettaFolder.add(casettaModel.scene.position, 'y', -200, 200)
        //gui.close();
    var params = {
        animatedRotation: false
    };
    const animationFolder = gui.addFolder('Animation')
    animationFolder.add(params, "animatedRotation").name("animated Rotation");

    const gekoFolder = gui.addFolder('Geko')
    gekoFolder.add(gekoModel.scene.position, 'x', -100, 100, 0.01)
    gekoFolder.add(gekoModel.scene.position, 'y', -100, 100, 0.01)
    gekoFolder.add(gekoModel.scene.position, 'z', -100, 100, 0.01)
    gekoFolder.add(gekoModel.scene.rotation, 'x', -100, 100, 0.01)
    gekoFolder.add(gekoModel.scene.rotation, 'y', -100, 100, 0.01)
    gekoFolder.add(gekoModel.scene.rotation, 'z', -100, 100, 0.01)
        //gekoFolder.add(scaleGeko, 'xa').min(0).max(200).listen();

    // Animation Loop
    var angle = 0;
    var radius = 80;

    function animate() {
        requestAnimationFrame(animate);
        //Loading View 
        if (resourse_loaded == true) {
            console.log("Risorse non caricate")
            renderer.render(loadingScreen.scene, loadingScreen.camera);
            return;
        }
        //Movement
        //camera.position.setX(x += 0.1 * Math.sin(1));
        if (params.animatedRotation) {
            camera.position.x = radius * Math.cos(angle);
            camera.position.z = radius * Math.sin(angle);
            angle += 0.003;
        }


        //Animation 
        var delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        controls.update();

        render()
    }

    animate();
}

/*
const casettaFolder = gui.addFolder('Casetta')
    //casettaFolder.add(scene.getObjectByName("Scene").position, 'z', 0, 200)
casettaFolder.add(camera.position, 'x', 0, 200)
casettaFolder.add(camera.position, 'y', 0, 200)
    //cameraFolder.open()
*/



render()
controls.target.set(0, 20, 0)

function render() {
    renderer.render(scene, camera);
}
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

//Casetta
/*mtlLoader.load(
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
    )*/



/*
//BUTTON
document.getElementById("myBtn").addEventListener("click", function() {
   
    //setTimeout(() => {
    //}, 1000);
});
*/