import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { HealthBar } from "../ui/HealthBar";
import { Geom, Scene } from "phaser";

export class Game extends Scene {
  private player!: Player;
  private enemy!: Enemy;
  private healthBar!: HealthBar;

  constructor() {
    super("Game");
  }

  create() {
    this.player = new Player(this);
    this.enemy = new Enemy(this, 150, 150);
    this.healthBar = new HealthBar(this);
  }

  update(_time: number, delta: number) {
    this.player.update(delta);
    this.enemy.update(delta, this.player);

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

    this.healthBar.update(this.player.getHealth(), this.player.getMaxHealth());
  }
}
