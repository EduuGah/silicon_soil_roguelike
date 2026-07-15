import { Scene } from "phaser";
import { Projectile } from "../entities/Projectile";

export abstract class Weapon {
  protected lastShotTime = 0;

  constructor(
    protected readonly scene: Scene,
    protected damage: number,
    protected cooldown: number,
    protected projectileSpeed: number,
    protected range: number,
  ) {}

  abstract shoot(
    originX: number,
    originY: number,
    targetX: number,
    targetY: number,
    currentTime: number,
  ): Projectile[];

  protected canShoot(currentTime: number): boolean {
    const timeSinceLastShot = currentTime - this.lastShotTime;

    if (timeSinceLastShot < this.cooldown) {
      return false;
    }

    this.lastShotTime = currentTime;
    return true;
  }

  reduceCooldownByPercentage(percentage: number): void {
    if (percentage <= 0 || percentage >= 1) {
      return;
    }

    this.cooldown = Math.max(80, this.cooldown * (1 - percentage));
  }

  getCooldown(): number {
    return this.cooldown;
  }
}
