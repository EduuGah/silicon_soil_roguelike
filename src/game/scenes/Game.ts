import { Geom, Input, Scene } from "phaser";

import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { HealthBar } from "../ui/HealthBar";
import { WaveManager } from "../systems/WaveManager";
import { DebugHUD } from "../ui/DebugHUD";

import { ExperienceOrb } from "../entities/ExperienceOrb";

export class Game extends Scene {
  private player!: Player;
  private healthBar!: HealthBar;
  private waveManager!: WaveManager;
  private experienceOrbs: ExperienceOrb[] = [];

  private debugHUD!: DebugHUD;

  private projectiles: Projectile[] = [];

  private handleExperienceOrbCollisions(): void {
    for (const orb of this.experienceOrbs) {
      if (!orb.isActive()) {
        continue;
      }

      const isColliding = Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        orb.getBounds(),
      );

      if (isColliding) {
        this.player.gainXp(orb.getXpValue());
        orb.collect();
      }
    }
  }

  private removeInactiveExperienceOrbs(): void {
    this.experienceOrbs = this.experienceOrbs.filter((orb) => orb.isActive());
  }

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

    for (const orb of this.experienceOrbs) {
      orb.update(delta, this.player.getX(), this.player.getY());
    }

    this.handleProjectileCollisions();
    this.handlePlayerCollisions();
    this.handleExperienceOrbCollisions();

    this.handleProjectileCollisions();
    this.handlePlayerCollisions();
    this.removeInactiveProjectiles();
    this.handleExperienceOrbCollisions();
    this.removeInactiveExperienceOrbs();

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
          const wasAlive = !enemy.isDead();

          enemy.takeDamage(projectile.getDamage());
          projectile.destroy();

          if (wasAlive && enemy.isDead()) {
            this.experienceOrbs.push(
              new ExperienceOrb(
                this,
                enemy.getX(),
                enemy.getY(),
                enemy.getXpReward(),
              ),
            );
          }

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
