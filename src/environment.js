import * as THREE from 'three';
import GameObject from './game_object';

export default class Environment extends GameObject {
  constructor(width, height) {
    super(width, height, new THREE.Vector2(0, 0));
    this.gravity = 0.5;
    this.children = Array.of();
    this.baseOffset = 0;
    this.limit = 0;
  }

  draw(ctx) {
    this.children.forEach((child) => child.draw(ctx));
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

  checkObstacle(caller) {
    let accY = true;
    this.children.forEach((child) => {
      if (this.checkIntersectY(caller, child)) {
        caller.accelerate(caller.velocity.x, 0);
        accY = false;
      }
      // if (this.checkIntersectX(caller, child)) {
      //   caller.accelerate(0, caller.velocity.y);
      // }
    });

    caller.position.y += caller.velocity.y;
    if (accY) caller.accelerate(caller.velocity.x, caller.parent.gravity + caller.velocity.y);

    if (caller.position.x > 0 + caller.width && caller.velocity.x < 0) {
      caller.position.x = Math.max(0, caller.position.x + caller.velocity.x);
    } else if (caller.position.x + caller.width < this.width - caller.width && caller.velocity.x > 0) {
      caller.position.x = Math.min(this.width - caller.width, caller.position.x + caller.velocity.x);
    } else {
      if (caller.x_offset + caller.velocity.x < caller.x_offset_limit) {
        const diff = caller.x_offset - caller.x_offset_limit;
        caller.x_offset -= diff;
        this.relativeMotion(diff);
      } else {
        caller.x_offset += caller.velocity.x;
        this.relativeMotion(-caller.velocity.x);
      }
    }

    this.checkGameOver(caller);
  }

  checkGameOver(caller) {
    if (caller.x_offset > this.limit
      || caller.position.y > this.height + 100) {
      caller.accelerate(0, 0);
      caller.disableMovement();
      this.children.forEach((child) => child.disableMovement());
      window.alert('Game Over!');
    }
  }

  checkIntersectY(caller, target) {
    if (target.key === 'background') return false;
    if (
      (
        (
          caller.position.y + caller.height <= target.position.y
          && caller.position.y + caller.height + caller.velocity.y >= target.position.y
        ) || (
          caller.position.y >= target.position.y + target.height
        && caller.position.y + caller.velocity.y <= target.position.y + target.height
        )
      )
      && (
        (caller.position.x > target.position.x
        && caller.position.x < target.position.x + target.width
        ) || (caller.position.x + caller.width > target.position.x
          && caller.position.x + caller.width < target.position.x + target.width
        ) || (caller.position.x < target.position.x
          && caller.position.x + caller.width > target.position.x + target.width
        )
      )
    ) {
      return true;
    }
    return false;
  }

  checkIntersectX(caller, target) {
    if (target.key === 'background') return false;
    if (
      (
        (
          caller.position.x + caller.width <= target.position.x
          && caller.position.x + caller.width + caller.velocity.x >= target.position.x
        )
        || (
          caller.position.x >= target.position.x + target.width
        && caller.position.x + caller.velocity.x <= target.position.x + target.width
        )
      )
      && (
        (caller.position.y > target.position.y
        && caller.position.y < target.position.y + target.height
        )
        || (caller.position.y + caller.height > target.position.y
          && caller.position.y + caller.height < target.position.y + target.height
        )
        || (caller.position.y < target.position.y
          && caller.position.y + caller.height > target.position.y + target.height
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
