import { GameObjects, Scene } from "phaser";

export class HealthBar {
  private readonly fill: GameObjects.Rectangle;
  private readonly padding = 2;

  private readonly barWidth = 200;
  private readonly barHeight = 20;

  private readonly fillWidth = this.barWidth - this.padding * 2;

  constructor(scene: Scene) {
    scene.add
      .rectangle(800, 30, this.barWidth, this.barHeight, 0x000000)
      .setOrigin(0, 0.5);
    this.fill = scene.add
      .rectangle(
        800,
        30,
        this.fillWidth,
        this.barHeight - this.padding * 2,
        0xff0000,
      )
      .setOrigin(0, 0.5);
  }

  update(currentHealth: number, maxHealth: number) {
    const healthPercentage = currentHealth / maxHealth;
    this.fill.width = this.fillWidth * healthPercentage;
  }
}
