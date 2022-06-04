/*eslint-disable*/
import * as THREE from 'three';
import GameObject from './game_object';

export default class Scene extends GameObject {
  constructor(width, height) {
    super(width, height, new THREE.Vector2(0, 0));
    this.gravity = 0.2;
    this.children = Array.of();
    this.baseOffset = 0;
    this.limit = 0;
    this.gameOver = false;
    this.player = null;
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.children.forEach((child) => {
      if (child.visible) child.draw(ctx);
    });
  }

  update(ctx) {
    this.children.forEach((child) => child.update(ctx, this));
  }

  relativeMotion(vx = 0) {
    this.children.forEach((child) => {
      child.velocity.x = child.key === 'background'
        ? vx === 0 ? vx : (vx < 0 ? vx + 2 : vx - 2)
        : vx;
    });
  }

  checkObstacle() {
    let accY = true;
    this.children.forEach((child) => {
      if (child.visible) {
        if (this.checkIntersectY(child)) {
          if (child.key === 'collapse') child.visible = false;
          else {
            this.player.accelerate(this.player.velocity.x, 0);
            accY = false;
            this.player.atRest = true;
          }
        }
        if (this.checkIntersectX(child)) {
          if (child.key === 'collapse') child.visible = false;
          else {
            this.player.accelerate(0, this.player.velocity.y);
            this.player.xhit = true;
          }
        } else {
          this.player.xhit = false;
        }
      }
    });

    if (!this.player.yhit) {
      this.player.position.y += this.player.velocity.y;
    }
    if (accY) this.player.accelerate(this.player.velocity.x, this.player.parent.gravity + this.player.velocity.y);

    if (!this.player.xhit) {
      if (this.player.position.x > 0 + this.player.width && this.player.velocity.x < 0) {
        this.player.position.x = Math.max(0, this.player.position.x + this.player.velocity.x);
      } else if (this.player.position.x + this.player.width < this.width - this.player.width && this.player.velocity.x > 0) {
        this.player.position.x = Math.min(this.width - this.player.width, this.player.position.x + this.player.velocity.x);
      } else {
        if (this.player.x_offset + this.player.velocity.x < this.player.x_offset_limit) {
          const diff = this.player.x_offset - this.player.x_offset_limit;
          this.player.x_offset -= diff;
          this.relativeMotion(diff);
        } else {
          this.player.x_offset += this.player.velocity.x;
          this.relativeMotion(-this.player.velocity.x);
        }
      }
    }

    this.gameOver = this.checkGameOver();
  }

  checkGameOver() {
    if (this.player.x_offset > this.limit
      || this.player.position.y > this.height + 100) {
      this.player.accelerate(0, 0);
      this.player.disableMovement();
      this.children.forEach((child) => child.disableMovement());
      return true;
    }
    return false;
  }

  checkIntersectY(target) {
    if (target.key === 'background' || !target.visible) return false;
    if (
      (
        (
          this.player.position.y + this.player.height <= target.position.y
          && this.player.position.y + this.player.height + this.player.velocity.y >= target.position.y
        ) || (
          this.player.position.y >= target.position.y + target.height
        && this.player.position.y + this.player.velocity.y <= target.position.y + target.height
        )
      )
      && (
        (this.player.position.x > target.position.x
        && this.player.position.x < target.position.x + target.width
        ) || (this.player.position.x + this.player.width > target.position.x
          && this.player.position.x + this.player.width < target.position.x + target.width
        ) || (this.player.position.x < target.position.x
          && this.player.position.x + this.player.width > target.position.x + target.width
        )
      )
    ) {
      return true;
    }
    return false;
  }

  checkIntersectX(target) {
    if (target.key === 'background') return false;
    if (
      (
        (
          this.player.position.x + this.player.width <= target.position.x
          && this.player.position.x + this.player.width + this.player.velocity.x >= target.position.x
        )
        || (
          this.player.position.x >= target.position.x + target.width
        && this.player.position.x + this.player.velocity.x <= target.position.x + target.width
        )
      )
      && (
        (this.player.position.y > target.position.y
        && this.player.position.y < target.position.y + target.height
        )
        || (this.player.position.y + this.player.height > target.position.y
          && this.player.position.y + this.player.height < target.position.y + target.height
        )
        || (this.player.position.y < target.position.y
          && this.player.position.y + this.player.height > target.position.y + target.height
        )
      )
    ) {
      return true;
    }
    return false;
  }

  addChild(child) {
    this.children.push(child);
  }
}
