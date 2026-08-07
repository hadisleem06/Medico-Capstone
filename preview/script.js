import * as THREE from "three";

import { GLTFLoader }
from "three/addons/loaders/GLTFLoader.js";



const container =
document.getElementById("scene");



const scene =
new THREE.Scene();




const camera =
new THREE.PerspectiveCamera(

45,

1,

0.1,

100

);


camera.position.z = 4;





const renderer =
new THREE.WebGLRenderer({

alpha:true,

antialias:true

});



renderer.setSize(
550,
550
);



renderer.setPixelRatio(
window.devicePixelRatio
);



container.appendChild(
renderer.domElement
);





// LIGHTS


const cyanLight =
new THREE.PointLight(
0x17afa2,
8,
10
);


cyanLight.position.set(
3,
3,
3
);


scene.add(cyanLight);





const purpleLight =
new THREE.PointLight(
0x8b5cf6,
5,
10
);


purpleLight.position.set(
-3,
2,
2
);


scene.add(purpleLight);





scene.add(

new THREE.AmbientLight(
0xffffff,
1
)

);






// DNA MODEL


const loader =
new GLTFLoader();



let dna;

let mixer;



const clock =
new THREE.Clock();





loader.load(

"./models/dna.glb",


function(gltf){



dna =
gltf.scene;



dna.scale.set(
4,
4,
4
);
dna.rotation.z = THREE.MathUtils.degToRad(-25);
dna.rotation.x = THREE.MathUtils.degToRad(10);
dna.rotation.y += 0.003;

scene.add(dna);





// PLAY DNA ANIMATION

if(gltf.animations.length > 0){


mixer =
new THREE.AnimationMixer(dna);



const animation =
mixer.clipAction(
gltf.animations[0]
);



animation.play();



}





animate();



},



undefined,

function(error){


console.error(
"DNA MODEL ERROR:",
error
);


}

);







function animate(){


requestAnimationFrame(
animate
);



const delta =
clock.getDelta();





// update DNA animation

if(mixer){

mixer.update(delta);

}






if(dna){



// slow rotation

dna.rotation.y += 0.003;





// floating movement

dna.position.y =
Math.sin(
Date.now()*0.002
)
*
0.08;



}





renderer.render(
scene,
camera
);



}