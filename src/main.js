/*eslint-disable*/
import * as THREE from 'three';
import GameObject from './game_object';
import Scene from './scene';
import Player from './player';
import NpObject from './np_object';
import brick from './assets/images/brick.png';
import sky from './assets/images/sky.png';
import rf1 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-1.png';
import rf2 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-2.png';
import rf3 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-3.png';
import rf4 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-4.png';
import rf5 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-5.png';
import rf6 from './assets/images/Jumping Boy Sprites/Transparent PNG/running/frame-6.png';
import sf1 from './assets/images/Jumping Boy Sprites/Transparent PNG/standing/frame-1.png';
import sf2 from './assets/images/Jumping Boy Sprites/Transparent PNG/standing/frame-2.png';
import jf1 from './assets/images/Jumping Boy Sprites/Transparent PNG/jump/jump_up.png';
import jf2 from './assets/images/Jumping Boy Sprites/Transparent PNG/jump/jump_fall.png';
import c1 from './assets/images/star coin rotate/star coin rotate 1.png';
import c2 from './assets/images/star coin rotate/star coin rotate 2.png';
import c3 from './assets/images/star coin rotate/star coin rotate 3.png';
import c4 from './assets/images/star coin rotate/star coin rotate 4.png';
import c5 from './assets/images/star coin rotate/star coin rotate 5.png';
import c6 from './assets/images/star coin rotate/star coin rotate 6.png';

function createImage(src) {
  let image = new Image();
  image.src = src;
  return image;
}

// export default function initGame() {
//   let canvas, context, env, backGround, player, obj1,  obj2, baseObj;
//   let setup = () => {
//     canvas = document.getElementById('GameScene');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     context = canvas.getContext('2d');
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     env = new Scene(canvas.width, canvas.height);
//     env.limit = 10000;
//     backGround = new GameObject(env.limit + env.width, env.height, new THREE.Vector2(0, 0), createImage(sky));
//     backGround.key = 'background';
//     backGround.enableMovement();
//     env.addChild(backGround);

//     player = new Player(env, [
//       createImage(sf1),
//       createImage(sf2),
//       createImage(rf1),
//       createImage(rf2),
//       createImage(rf3),
//       createImage(rf4),
//       createImage(rf5),
//       createImage(rf6),
//       createImage(jf1),
//       createImage(jf2),
//       (player) => {
//         // console.log(player.velocity);
//         if (player.velocity.y === 0 && player.velocity.x === 0) {
//           if (player.frame > 2) {
//             player.frame = 0;
//             player.frameStart = 0;
//             player.frameLimit = 2;
//           }
//         } else if (player.velocity.y < 0) {
//           if (player.frame !== 8) {
//             player.frame = 8;
//             player.frameStart = 8;
//             player.frameLimit = 8;
//           }
//         } else if (player.velocity.y > player.parent.gravity) {
//           if (player.frame !== 9) {
//             player.frame = 9;
//             player.frameStart = 9;
//             player.frameLimit = 9;
//           }
//         } else if (player.velocity.x !== 0) {
//           if (player.frame < 2 || player.frame > 7) {
//             player.frame = 2;
//             player.frameStart = 2;
//             player.frameLimit = 7;
//           }
//         }
//       }
//     ]);
//     player.enableMovement();

//     obj1 = new NpObject(env, 250, 700, 250, 50, createImage(brick));
//     obj1.key = 'foreground';
//     obj1.enableMovement();

//     obj2 = new NpObject(env, obj1.position.x + obj1.width / 2, 
//     obj1.position.y - 50, 50, 50, [
//       createImage(c1),
//       createImage(c2),
//       createImage(c3),
//       createImage(c4),
//       createImage(c5),
//       createImage(c6),
//       null,
//     ]);
//     obj2.frameStart = 0;
//     obj2.frameLimit = 6;
//     obj2.key = 'collapse';
//     obj2.enableMovement();

//     while (env.baseOffset < env.limit + env.width) {
//       baseObj = new NpObject(env, env.baseOffset, env.height - 50, 350, 50, createImage(brick));
//       env.baseOffset += baseObj.width + 250;
//       baseObj.key = 'foreground';
//       baseObj.enableMovement();
//     }
//   }

//   setup();

//   let animate = () => {
//     if (env.gameOver) initGame()
//     else requestAnimationFrame(animate)
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     env.update(context);
//     env.draw(context);
//     player.update(context);
//     player.draw(context);
//   };
//   animate();
// }


export default function initGame() {
  var renderer, scene, camera, canvas;

  const setup = () => {
    canvas = document.getElementById('canvas');

     //RENDERER
    renderer = new THREE.WebGLRenderer({
      canvas: canvas, 
      antialias: true
    });
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //CAMERA
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000 );

    //SCENE
    scene = new THREE.Scene();

    //LIGHTS
    var light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    var light2 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light2);

    var customUniforms = {
        delta: {value: 0}
    };
    var material = new THREE.ShaderMaterial({
        uniforms: customUniforms,
        vertexShader: document.getElementById('vertexShader2').textContent,
        fragmentShader: document.getElementById('fragmentShader2').textContent
    });


    
    var geometry = new THREE.BoxBufferGeometry(100, 100, 100, 10, 10, 10);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -1000;
    mesh.position.x = -100;
    scene.add(mesh);

    var geometry2 = new THREE.SphereGeometry(50, 20, 20);
    var mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.z = -1000;
    mesh2.position.x = 100;
    scene.add(mesh2);


    var geometry3 = new THREE.PlaneGeometry(10000, 10000, 100, 100);
    var mesh3 = new THREE.Mesh(geometry3, material);
    mesh3.rotation.x = -90 * Math.PI / 180;
    mesh3.position.y = -100;
    scene.add(mesh3);

    //attribute
    var vertexDisplacement = new Float32Array(geometry.attributes.position.count);

    for (var i = 0; i < vertexDisplacement.length; i ++) {
        vertexDisplacement[i] = Math.sin(i);
    }

    geometry.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1));
  }
  var delta = 0;
  const render = ()=> {
      delta += 0.1;

      //uniform
      mesh.material.uniforms.delta.value = 0.5 + Math.sin(delta) * 0.5;

      //attribute
      for (var i = 0; i < vertexDisplacement.length; i ++) {
          vertexDisplacement[i] = 0.5 + Math.sin(i + delta) * 0.25;
      }
      mesh.geometry.attributes.vertexDisplacement.needsUpdate = true;


    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
    setup();
    //RENDER LOOP
    render();
}
