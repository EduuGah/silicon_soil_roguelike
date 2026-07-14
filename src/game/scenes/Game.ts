import { Geom, Input, Scene } from "phaser";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { Projectile } from "../entities/Projectile";
import { HealthBar } from "../ui/HealthBar";

export class Game extends Scene {
  private player!: Player;
  private enemy!: Enemy;
  private healthBar!: HealthBar;

  private projectiles: Projectile[] = [];

  constructor() {
    super("Game");
  }

  create() {
    this.player = new Player(this);
    this.enemy = new Enemy(this, 150, 150);
    this.healthBar = new HealthBar(this);

    this.input.on("pointerdown", (pointer: Input.Pointer) => {
      const projectile = this.player.shoot(
        pointer.x,
        pointer.y,
        this.time.now,
      );

      if (projectile) {
        this.projectiles.push(projectile);
      }
    });
  }

  update(_time: number, delta: number) {
    this.player.update(delta);
    this.enemy.update(delta, this.player);

    for (const projectile of this.projectiles) {
      projectile.update(delta);
    }

    this.projectiles = this.projectiles.filter(
      (projectile) => projectile.isActive(),
    );

    const isColliding = Geom.Intersects.RectangleToRectangle(
      this.player.getBounds(),
      this.enemy.getBounds(),
    );

    if (isColliding) {
      this.player.takeContactDamage(
        this.enemy.getDamage(),
        this.enemy.getX(),
        this.enemy.getY(),
      );
    }

    this.healthBar.update(
      this.player.getHealth(),
      this.player.getMaxHealth(),
    );
  }
}