import * as THREE from 'three';

export default class GameObject {
  constructor(width, height, position, image) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.movementEnabled = false;
    this.velocity = new THREE.Vector2(0, 0);
    this.image = image;
    this.frame = 0;
    this.visible = true;
    this.frameStart = 0;
    this.frameLimit = 0;
    this.imageFrameHandler = null;
    if (this.image && !(this.image instanceof Array)) {
      this.image.width = window.innerWidth;
      this.image.height = window.innerHeight;
    } else if (this.image instanceof Array) {
      this.imageFrameHandler = this.image[this.image.length - 1];
    }
    this.key = 'generic';
    if (this.image instanceof Array) setInterval(() => this.animateImageFrame(this), 100);
  }

  setVisible(arg = true) {
    this.visible = arg;
  }

  animateImageFrame(player) {
    this.frame++;
    if (this.frame >= this.frameLimit) this.frame = this.frameStart;
  }

  draw(ctx) {
    if (this.image && !(this.image instanceof Array)) {
      const xnum = Math.ceil(this.width / this.image.width);
      const ynum = Math.ceil(this.height / this.image.height);
      for (let x = 0; x < xnum; x++) {
        for (let y = 0; y < ynum; y++) {
          ctx.drawImage(this.image, this.position.x + (this.image.width * x), this.position.y + (this.image.height * y), this.image.width, this.image.height);
        }
      }
    } else if (this.image instanceof Array) {
      ctx.drawImage(this.image[this.frame], this.position.x, this.position.y, this.width, this.height);
    }
  }

  update(ctx) {
    if (this.image instanceof Array) {
      if (this.imageFrameHandler) this.imageFrameHandler(this);
    }

    if (this.movementEnabled) {
      this.position.y += this.velocity.y;
      this.position.x += this.velocity.x;
    }
  }

  freeze(x = 0, y = 0) {
    this.velocity.x = x;
    this.velocity.y = y;
  }

  enableMovement() {
    this.movementEnabled = true;
  }

  disableMovement() {
    this.movementEnabled = false;
  }
}
