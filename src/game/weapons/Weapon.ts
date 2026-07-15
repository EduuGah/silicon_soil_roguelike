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
  ): Projectile | null;
}