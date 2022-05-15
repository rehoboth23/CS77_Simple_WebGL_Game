import * as THREE from 'three';
import GameObject from './game_object';

export default class NpObject extends GameObject {
  constructor(env, px, py, w, h, image) {
    super(w, h, new THREE.Vector2(px, py), image);
    this.parent = env;
    this.color = 'blue';
    this.image.width = 50;
    this.image.height = 50;
    env.addChild(this);
  }

  freeze(x = 0, y = 0) {
    this.velocity.x = x;
    this.velocity.y = y;
  }

  accelerate(x = 0, y = 0) {
    this.velocity.x = x;
    this.velocity.y = y;
  }
}
