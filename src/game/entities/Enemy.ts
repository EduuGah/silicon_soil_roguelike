import { Math as PhaserMath, Scene } from "phaser";
import { Entity } from "./Entity";

export class Enemy extends Entity {
  private readonly separationRadius = 75;
  private readonly separationStrength = 2.5;
  private readonly xpReward = 25;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 48, 48, 0xff3355, 40, 120, 5);
  }

  update(delta: number, target: Entity, nearbyEnemies: readonly Enemy[]): void {
    const movementDirection = new PhaserMath.Vector2(
      target.getX() - this.body.x,
      target.getY() - this.body.y,
    ).normalize();

    const separationDirection = this.calculateSeparation(nearbyEnemies);

    movementDirection.add(separationDirection.scale(this.separationStrength));

    if (movementDirection.lengthSq() > 0) {
      movementDirection.normalize();
    }

    const deltaSeconds = delta / 1000;

    this.body.x += movementDirection.x * this.speed * deltaSeconds;
    this.body.y += movementDirection.y * this.speed * deltaSeconds;
  }

  private calculateSeparation(
    nearbyEnemies: readonly Enemy[],
  ): PhaserMath.Vector2 {
    const separation = new PhaserMath.Vector2(0, 0);

    for (const enemy of nearbyEnemies) {
      if (enemy === this || enemy.isDead()) {
        continue;
      }

      const difference = new PhaserMath.Vector2(
        this.body.x - enemy.getX(),
        this.body.y - enemy.getY(),
      );

      const distance = difference.length();

      if (distance === 0 || distance >= this.separationRadius) {
        continue;
      }

      difference.normalize().scale(1 - distance / this.separationRadius);

      separation.add(difference);
    }

    return separation;
  }
  getXpReward(): number {
    return this.xpReward;
  }
}
