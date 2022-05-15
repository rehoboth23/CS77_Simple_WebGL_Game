import * as THREE from 'three';
import GameObject from './game_object';
import Environment from './environment';
import Player from './player';
import NpObject from './np_object';
import brick from './assets/images/brick.png';
import sky from './assets/images/spooky.gif';

function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

export default function initGame() {
  const canvas = document.getElementById('GameScene');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const context = canvas.getContext('2d');
  const env = new Environment(canvas.width, canvas.height);
  env.limit = 2500;
  const backGround = new GameObject(env.limit + env.width, env.height, new THREE.Vector2(0, 0), createImage(sky));
  backGround.key = 'background';
  backGround.enableMovement();
  env.addChild(backGround);

  const player = new Player(env, null);
  player.enableMovement();
  const obj1 = new NpObject(env, 250, 550, 250, 50, createImage(brick));
  obj1.enableMovement();

  while (env.baseOffset < env.limit + env.width) {
    const baseObj = new NpObject(env, env.baseOffset, env.height - 50, 350, 50, createImage(brick));
    env.baseOffset += baseObj.width + 250;
    baseObj.enableMovement();
  }

  const animate = () => {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    env.update(context);
    player.update(context);
  };
  animate();
}
