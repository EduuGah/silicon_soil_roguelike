import { Scene } from "phaser";
import { Projectile } from "../entities/Projectile";

export abstract class Weapon {
  protected lastShotTime = 0;

  constructor(
    protected readonly scene: Scene,
    protected readonly damage: number,
    protected readonly cooldown: number,
    protected readonly projectileSpeed: number,
    protected readonly range: number,
  ) {}

  abstract shoot(
    originX: number,
    originY: number,
    targetX: number,
    targetY: number,
    currentTime: number,
  ): Projectile | null;
}