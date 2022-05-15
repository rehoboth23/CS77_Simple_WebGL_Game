import * as THREE from 'three';

export default class GameObject {
  constructor(width, height, position, image) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.movementEnabled = false;
    this.velocity = new THREE.Vector2(0, 0);
    this.image = image;
    if (this.image) {
      this.image.width = window.innerWidth;
      this.image.height = window.innerHeight;
    }
    this.key = 'generic';
  }

  draw(ctx) {
    const xnum = Math.ceil(this.width / this.image.width);
    const ynum = Math.ceil(this.height / this.image.height);
    for (let x = 0; x < xnum; x++) {
      for (let y = 0; y < ynum; y++) {
        ctx.drawImage(this.image, this.position.x + (this.image.width * x), this.position.y + (this.image.height * y), this.image.width, this.image.height);
      }
    }
  }

  update(ctx) {
    this.draw(ctx);
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
