import { GameObjects, Geom, Scene } from "phaser";

export abstract class Entity {
  protected readonly body: GameObjects.Rectangle;
  protected readonly scene: Scene;

  protected health: number;
  protected maxHealth: number;
  protected speed: number;
  protected damage: number;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    maxHealth: number,
    speed: number,
    damage: number,
  ) {
    this.scene = scene;

    this.body = scene.add.rectangle(x, y, width, height, color);

    this.health = maxHealth;
    this.maxHealth = maxHealth;
    this.speed = speed;
    this.damage = damage;
  }

  public takeDamage(amount: number): void {
    if (amount <= 0 || this.isDead()) {
      return;
    }

    this.health = Math.max(0, this.health - amount);
  }

  public heal(amount: number): void {
    if (amount <= 0) {
      return;
    }

    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public isDead(): boolean {
    return this.health <= 0;
  }

  public getHealth(): number {
    return this.health;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  public getDamage(): number {
    return this.damage;
  }

  public getBounds(): Geom.Rectangle {
    return this.body.getBounds();
  }

  public getX(): number {
    return this.body.x;
  }

  public getY(): number {
    return this.body.y;
  }

  public getWidth(): number {
    return this.body.width;
  }

  public getHeight(): number {
    return this.body.height;
  }

  destroy(): void {
    this.body.destroy();
  }
}