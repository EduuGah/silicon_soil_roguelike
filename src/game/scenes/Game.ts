import { Geom, Input, Scene } from "phaser";

import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { ExperienceOrb } from "../entities/ExperienceOrb";

import { UpgradeSelection } from "../ui/UpgradeSelection";

import { HealthBar } from "../ui/HealthBar";
import { DebugHUD } from "../ui/DebugHUD";

import { WaveManager } from "../systems/WaveManager";
import { UpgradeManager } from "../systems/UpgradeManager";

export class Game extends Scene {
  private player!: Player;

  private healthBar!: HealthBar;
  private debugHUD!: DebugHUD;

  private waveManager!: WaveManager;
  private upgradeManager!: UpgradeManager;

  private projectiles: Projectile[] = [];
  private experienceOrbs: ExperienceOrb[] = [];

  private selectingUpgrade = false;
  private pendingUpgradeSelections = 0;

  private upgradeSelection?: UpgradeSelection;

  constructor() {
    super("Game");
  }

  create(): void {
    this.player = new Player(this);

    this.waveManager = new WaveManager(this);
    this.upgradeManager = new UpgradeManager();

    this.healthBar = new HealthBar(this);

    this.debugHUD = new DebugHUD(this, this.player, this.waveManager);

    this.waveManager.startNextWave();

    this.input.on("pointerdown", (pointer: Input.Pointer) => {
      if (this.selectingUpgrade) {
        return;
      }

      const projectile = this.player.shoot(pointer.x, pointer.y, this.time.now);

      if (projectile) {
        this.projectiles.push(projectile);
      }
    });
  }

  update(_time: number, delta: number): void {
    /*
     * Enquanto a tela de upgrades estiver aberta,
     * o gameplay não será atualizado.
     *
     * A interface continuará respondendo porque não
     * pausamos a Scene inteira.
     */
    if (this.selectingUpgrade) {
      return;
    }

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

    this.removeInactiveProjectiles();
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

        if (!isColliding) {
          continue;
        }

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

  private handlePlayerCollisions(): void {
    for (const enemy of this.waveManager.getEnemies()) {
      if (enemy.isDead()) {
        continue;
      }

      const isColliding = Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        enemy.getBounds(),
      );

      if (!isColliding) {
        continue;
      }

      this.player.takeContactDamage(
        enemy.getDamage(),
        enemy.getX(),
        enemy.getY(),
      );
    }
  }

  private handleExperienceOrbCollisions(): void {
    for (const orb of this.experienceOrbs) {
      if (!orb.isActive()) {
        continue;
      }

      const isColliding = Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        orb.getBounds(),
      );

      if (!isColliding) {
        continue;
      }

      const levelsGained = this.player.gainXp(orb.getXpValue());

      orb.collect();

      if (levelsGained > 0) {
        this.pendingUpgradeSelections += levelsGained;
      }
    }

    this.tryOpenUpgradeSelection();
  }

  private tryOpenUpgradeSelection(): void {
    if (this.selectingUpgrade || this.pendingUpgradeSelections <= 0) {
      return;
    }

    this.selectingUpgrade = true;
    this.pendingUpgradeSelections--;

    const choices = this.upgradeManager.getRandomChoices(3);

    this.upgradeSelection = new UpgradeSelection(
      this,
      choices,
      (selectedUpgrade) => {
        selectedUpgrade.apply(this.player);

        this.upgradeSelection?.destroy();
        this.upgradeSelection = undefined;

        this.selectingUpgrade = false;

        this.healthBar.update(
          this.player.getHealth(),
          this.player.getMaxHealth(),
        );

        this.debugHUD.update();

        this.tryOpenUpgradeSelection();
      },
    );
  }

  private removeInactiveProjectiles(): void {
    this.projectiles = this.projectiles.filter((projectile) =>
      projectile.isActive(),
    );
  }

  private removeInactiveExperienceOrbs(): void {
    this.experienceOrbs = this.experienceOrbs.filter((orb) => orb.isActive());
  }
}
