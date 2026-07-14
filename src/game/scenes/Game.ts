import { Geom, Input, Scene } from "phaser";

import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { HealthBar } from "../ui/HealthBar";
import { WaveManager } from "../systems/WaveManager";
import { DebugHUD } from "../ui/DebugHUD";

export class Game extends Scene {
  private player!: Player;
  private healthBar!: HealthBar;
  private waveManager!: WaveManager;

  private debugHUD!: DebugHUD;

  private projectiles: Projectile[] = [];

  constructor() {
    super("Game");
  }

  create(): void {
    this.player = new Player(this);
    this.healthBar = new HealthBar(this);

    this.waveManager = new WaveManager(this);
    this.waveManager.startNextWave();

    this.input.on("pointerdown", (pointer: Input.Pointer) => {
      const projectile = this.player.shoot(pointer.x, pointer.y, this.time.now);

      if (projectile) {
        this.projectiles.push(projectile);
      }
    });
    this.debugHUD = new DebugHUD(this, this.player, this.waveManager);
  }

  update(_time: number, delta: number): void {
    this.player.update(delta);
    this.waveManager.update(delta, this.player);

    for (const projectile of this.projectiles) {
      projectile.update(delta);
    }

    this.handleProjectileCollisions();
    this.handlePlayerCollisions();
    this.removeInactiveProjectiles();

    this.healthBar.update(this.player.getHealth(), this.player.getMaxHealth());

    this.debugHUD.update();
  }

  private handleProjectileCollisions(): void {
    for (const projectile of this.projectiles) {
      if (!projectile.isActive()) {
        continue;
      }

      for (const enemy of this.waveManager.getEnemies()) {
        if (enemy.isDead()) {
          continue;
        }

        const isColliding = Geom.Intersects.RectangleToRectangle(
          projectile.getBounds(),
          enemy.getBounds(),
        );

        if (isColliding) {
          enemy.takeDamage(projectile.getDamage());
          projectile.destroy();
          break;
        }
      }
    }
  }

  private handlePlayerCollisions(): void {
    for (const enemy of this.waveManager.getEnemies()) {
      if (enemy.isDead()) {
        continue;
      }

      const isColliding = Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        enemy.getBounds(),
      );

      if (isColliding) {
        this.player.takeContactDamage(
          enemy.getDamage(),
          enemy.getX(),
          enemy.getY(),
        );
      }
    }
  }

  private removeInactiveProjectiles(): void {
    this.projectiles = this.projectiles.filter((projectile) =>
      projectile.isActive(),
    );
  }
}
