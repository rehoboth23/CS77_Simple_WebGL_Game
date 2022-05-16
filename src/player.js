import * as THREE from 'three';
import GameObject from './game_object';

export default class Player extends GameObject {
  constructor(env, image) {
    super(50, 100, new THREE.Vector2(100, 100), image);
    this.force = new THREE.Vector2(5, 10);
    env.player = this;
    this.parent = env;
    this.color = 'red';
    this.x_offset = this.position.x;
    this.x_offset_limit = this.position.x;
    this.frame = 0;
    this.frameStart = 0;
    this.frameLimit = 2;
    this.flip = false;
    this.consecutiveClicks = 0;
    this.atRest = true;
  }

  draw(ctx) {
    if (this.image instanceof Array) {
      if (this.flip) {
        ctx.scale(-1, 1);
        ctx.drawImage(this.image[this.frame], -this.position.x, this.position.y, this.width, this.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        ctx.drawImage(this.image[this.frame], this.position.x, this.position.y, this.width, this.height);
      }
    } else {
      ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
  }

  animateImageFrame(player) {
    this.frame++;
    if (this.frame >= this.frameLimit) this.frame = this.frameStart;
  }

  update(ctx) {
    if (this.image instanceof Array) {
      this.imageFrameHandler(this);
    }

    if (this.atRest) {
      this.consecutiveClicks = 0;
    }

    if (this.velocity.y < 0) this.atRest = 0;

    if (this.movementEnabled) {
      this.parent.checkObstacle();
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
          if (this.consecutiveClicks < 2) {
            this.accelerate(this.velocity.x, -this.force.y);
            this.consecutiveClicks++;
            this.atRest = false;
          }
          break;
        case 'ArrowDown':
          this.accelerate(this.velocity.x, this.force.y);
          break;
        case 'ArrowLeft':
          this.force.x = -5;
          this.accelerate(this.force.x, this.velocity.y);
          this.flip = true;
          break;
        case 'ArrowRight':
          this.force.x = 5;
          this.accelerate(this.force.x, this.velocity.y);
          this.flip = false;
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
