import { GameObjects, Geom, Scene } from "phaser";

export class ExperienceOrb {
  private readonly body: GameObjects.Ellipse;
  private active = true;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    private readonly xpValue: number,
  ) {
    this.body = scene.add.ellipse(
      x,
      y,
      14,
      14,
      0x00ffff,
    );
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
}