import { GameObjects, Geom, Scene, Math as PhaserMath } from "phaser";

export class ExperienceOrb {
  private readonly body: GameObjects.Ellipse;
  private active = true;

  private readonly attractionRadius = 140;
  private readonly attractionSpeed = 320;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    private readonly xpValue: number,
  ) {
    this.body = scene.add.ellipse(x, y, 14, 14, 0x00ffff);
  }

  

  getBounds(): Geom.Rectangle {
    return this.body.getBounds();
  }

  getXpValue(): number {
    return this.xpValue;
  }

  isActive(): boolean {
    return this.active;
  }

  collect(): void {
    if (!this.active) {
      return;
    }

    this.active = false;
    this.body.destroy();
  }

  update(delta: number, playerX: number, playerY: number): void {
    const direction = new PhaserMath.Vector2(
      playerX - this.body.x,
      playerY - this.body.y,
    );

    const distance = direction.length();

    if (distance > this.attractionRadius) {
      return;
    }

    direction.normalize();

    const deltaSeconds = delta / 1000;

    this.body.x += direction.x * this.attractionSpeed * deltaSeconds;
    this.body.y += direction.y * this.attractionSpeed * deltaSeconds;
  }
}
