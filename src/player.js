import * as THREE from 'three';
import GameObject from './game_object';

export default class Player extends GameObject {
  constructor(env, image) {
    super(100, 100, new THREE.Vector2(100, 100), null);
    this.force = new THREE.Vector2(5, 20);
    this.parent = env;
    this.color = 'red';
    this.x_offset = this.position.x;
    this.x_offset_limit = this.position.x;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);
    if (this.movementEnabled) {
      this.parent.checkObstacle(this);
    }
  }

  accelerate(x = 0, y = 0) {
    this.velocity.x = x;
    this.velocity.y = y;
  }

  enableMovement() {
    window.addEventListener('keydown', (event) => {
      const { key } = event;
      switch (key) {
        case 'ArrowUp':
          this.accelerate(this.velocity.x, -this.force.y);
          break;
        case 'ArrowDown':
          this.accelerate(this.velocity.x, this.force.y);
          break;
        case 'ArrowLeft':
          this.force.x = -5;
          this.accelerate(this.force.x, this.velocity.y);
          break;
        case 'ArrowRight':
          this.force.x = 5;
          this.accelerate(this.force.x, this.velocity.y);
          break;
        default:
          break;
      }
    });
    window.addEventListener('keyup', (event) => {
      const { key } = event;
      switch (key) {
        case 'ArrowLeft': case 'ArrowRight':
          this.accelerate(0, this.velocity.y);
          break;
        default:
          break;
      }
    });
    this.movementEnabled = true;
  }

  disableMovement() {
    window.addEventListener('keydown', (_) => {
      this.parent.relativeMotion(0, 0);
    });
    window.addEventListener('keyup', (_) => {});
    this.movementEnabled = false;
  }
}
