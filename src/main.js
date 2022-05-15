/*eslint-disable*/
import * as THREE from 'three';
import GameObject from './game_object';
import Scene from './scene';
import Player from './player';
import NpObject from './np_object';
import brick from './assets/images/brick.png';
import sky from './assets/images/spooky.gif';
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

function createImage(src) {
  let image = new Image();
  image.src = src;
  return image;
}

export default function initGame() {
  let canvas;
  let context;
  let env;
  let backGround;
  let player;
  let obj1;
  let baseObj;
  let setup = () => {
    canvas = document.getElementById('GameScene');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    env = new Scene(canvas.width, canvas.height);
    env.limit = 10000;
    backGround = new GameObject(env.limit + env.width, env.height, new THREE.Vector2(0, 0), createImage(sky));
    backGround.key = 'background';
    backGround.enableMovement();
    env.addChild(backGround);

    player = new Player(env, [
      createImage(sf1),
      createImage(sf2),
      createImage(rf1),
      createImage(rf2),
      createImage(rf3),
      createImage(rf4),
      createImage(rf5),
      createImage(rf6),
      createImage(jf1),
      createImage(jf2),
    ]);

    player.enableMovement();
    obj1 = new NpObject(env, 250, 550, 250, 50, createImage(brick));
    obj1.enableMovement();

    while (env.baseOffset < env.limit + env.width) {
      baseObj = new NpObject(env, env.baseOffset, env.height - 50, 350, 50, createImage(brick));
      env.baseOffset += baseObj.width + 250;
      baseObj.enableMovement();
    }
  }

  setup();

  let animate = () => {
    if (env.gameOver) initGame()
    else requestAnimationFrame(animate)
    context.clearRect(0, 0, canvas.width, canvas.height);
    env.update(context);
    player.update(context);
  };
  animate();
}
