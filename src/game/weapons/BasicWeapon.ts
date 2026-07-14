import { Scene } from "phaser";
import { Projectile } from "../entities/Projectile";
import { Weapon } from "./Weapon";

export class BasicWeapon extends Weapon {
  constructor(scene: Scene) {
    super(scene, 10, 300, 600, 700);
  }

  shoot(
    originX: number,
    originY: number,
    targetX: number,
    targetY: number,
    currentTime: number,
  ): Projectile | null {
    const timeSinceLastShot = currentTime - this.lastShotTime;

    if (timeSinceLastShot < this.cooldown) {
      return null;
    }

    this.lastShotTime = currentTime;

    return new Projectile(
      this.scene,
      originX,
      originY,
      targetX,
      targetY,
      this.projectileSpeed,
      this.damage,
      this.range,
    );
  }
}
