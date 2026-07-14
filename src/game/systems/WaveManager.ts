import { Math as PhaserMath, Scene } from "phaser";

import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";

export class WaveManager {
  private enemies: Enemy[] = [];
  private currentWave = 0;

  constructor(private readonly scene: Scene) {}

  startNextWave(): void {
    this.currentWave++;

    const quantityEnemies = this.currentWave + 2;

    for (let index = 0; index < quantityEnemies; index++) {
      const position = this.generateSpawnPosition();

      const enemy = new Enemy(
        this.scene,
        position.x,
        position.y,
      );

      this.enemies.push(enemy);
    }
  }

  update(delta: number, player: Player): void {
    for (const enemy of this.enemies) {
      enemy.update(delta, player, this.enemies);
    }

    this.removeDeadEnemies();

    if (this.enemies.length === 0) {
      this.startNextWave();
    }
  }

  private removeDeadEnemies(): void {
    for (const enemy of this.enemies) {
      if (enemy.isDead()) {
        enemy.destroy();
      }
    }

    this.enemies = this.enemies.filter(
      (enemy) => !enemy.isDead(),
    );
  }

  private generateSpawnPosition(): {
    x: number;
    y: number;
  } {
    const enemyHalfSize = 24;

    const minX = enemyHalfSize;
    const maxX = this.scene.scale.width - enemyHalfSize;

    const minY = enemyHalfSize;
    const maxY = this.scene.scale.height - enemyHalfSize;

    const selectedEdge = PhaserMath.Between(0, 3);

    switch (selectedEdge) {
      case 0:
        return {
          x: PhaserMath.Between(minX, maxX),
          y: minY,
        };

      case 1:
        return {
          x: maxX,
          y: PhaserMath.Between(minY, maxY),
        };

      case 2:
        return {
          x: PhaserMath.Between(minX, maxX),
          y: maxY,
        };

      default:
        return {
          x: minX,
          y: PhaserMath.Between(minY, maxY),
        };
    }
  }

  getEnemies(): readonly Enemy[] {
    return this.enemies;
  }

  getCurrentWave(): number {
    return this.currentWave;
  }
}