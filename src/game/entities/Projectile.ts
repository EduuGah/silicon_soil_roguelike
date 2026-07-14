import {
  GameObjects,
  Geom,
  Math as PhaserMath,
  Scene,
} from "phaser";

export class Projectile {
  private readonly body: GameObjects.Rectangle;
  private readonly direction: PhaserMath.Vector2;

  private active = true;
  private traveledDistance = 0;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    private readonly speed: number,
    private readonly damage: number,
    private readonly range: number,
  ) {
    this.body = scene.add.rectangle(
      x,
      y,
      12,
      12,
      0xffff00,
    );

    this.direction = new PhaserMath.Vector2(
      targetX - x,
      targetY - y,
    ).normalize();
  }

  update(delta: number): void {
    if (!this.active) {
      return;
    }

    const deltaSeconds = delta / 1000;
    const distanceThisFrame = this.speed * deltaSeconds;

    this.body.x += this.direction.x * distanceThisFrame;
    this.body.y += this.direction.y * distanceThisFrame;

    this.traveledDistance += distanceThisFrame;

    if (this.traveledDistance >= this.range) {
      this.destroy();
    }
  }

  getBounds(): Geom.Rectangle {
    return this.body.getBounds();
  }

  getDamage(): number {
    return this.damage;
  }

  isActive(): boolean {
    return this.active;
  }

  destroy(): void {
    if (!this.active) {
      return;
    }

    this.active = false;
    this.body.destroy();
  }
}