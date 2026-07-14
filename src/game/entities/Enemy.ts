import { Entity } from "./Entity";
import { Math as PhaserMath, Scene } from "phaser";

export class Enemy extends Entity {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 48, 48, 0xff3355, 40, 120, 1);
  }

  update(delta: number, target: Entity): void {
    const direction = new PhaserMath.Vector2(
      target.getX() - this.body.x,
      target.getY() - this.body.y,
    );

    direction.normalize();

    const deltaSeconds = delta / 1000;

    this.body.x += direction.x * this.speed * deltaSeconds;
    this.body.y += direction.y * this.speed * deltaSeconds;
  }
}
