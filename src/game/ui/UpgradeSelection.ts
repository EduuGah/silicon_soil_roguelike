import {
  GameObjects,
  Scene,
} from "phaser";

import { Upgrade } from "../upgrades/Upgrade";

export class UpgradeSelection {
  private readonly container: GameObjects.Container;

  constructor(
    scene: Scene,
    upgrades: Upgrade[],
    onSelect: (upgrade: Upgrade) => void,
  ) {
    const screenWidth = scene.scale.width;
    const screenHeight = scene.scale.height;

    this.container = scene.add.container(0, 0);

    const overlay = scene.add.rectangle(
      0,
      0,
      screenWidth,
      screenHeight,
      0x000000,
      0.75,
    ).setOrigin(0);

    const title = scene.add.text(
      screenWidth / 2,
      130,
      "Escolha uma atualização",
      {
        fontSize: "32px",
        color: "#ffffff",
        fontStyle: "bold",
      },
    ).setOrigin(0.5);

    this.container.add([
      overlay,
      title,
    ]);

    this.createUpgradeCards(
      scene,
      upgrades,
      onSelect,
    );

    this.container.setDepth(1000);
  }

  private createUpgradeCards(
    scene: Scene,
    upgrades: Upgrade[],
    onSelect: (upgrade: Upgrade) => void,
  ): void {
    const cardWidth = 240;
    const cardHeight = 260;
    const cardSpacing = 30;

    const totalWidth =
      upgrades.length * cardWidth +
      (upgrades.length - 1) * cardSpacing;

    const startingX =
      (scene.scale.width - totalWidth) / 2 +
      cardWidth / 2;

    const cardY = scene.scale.height / 2;

    upgrades.forEach((upgrade, index) => {
      const cardX =
        startingX +
        index * (cardWidth + cardSpacing);

      const card = this.createUpgradeCard(
        scene,
        cardX,
        cardY,
        cardWidth,
        cardHeight,
        upgrade,
        onSelect,
      );

      this.container.add(card);
    });
  }

  private createUpgradeCard(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    upgrade: Upgrade,
    onSelect: (upgrade: Upgrade) => void,
  ): GameObjects.Container {
    const cardContainer = scene.add.container(x, y);

    const background = scene.add.rectangle(
      0,
      0,
      width,
      height,
      0x18202b,
    );

    background.setStrokeStyle(
      2,
      0x00ff88,
    );

    background.setInteractive({
      useHandCursor: true,
    });

    const nameText = scene.add.text(
      0,
      -70,
      upgrade.name,
      {
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
        align: "center",
        wordWrap: {
          width: width - 30,
        },
      },
    ).setOrigin(0.5);

    const descriptionText = scene.add.text(
      0,
      15,
      upgrade.description,
      {
        fontSize: "16px",
        color: "#cdd6df",
        align: "center",
        wordWrap: {
          width: width - 40,
        },
      },
    ).setOrigin(0.5);

    background.on("pointerover", () => {
      background.setFillStyle(0x263445);
      background.setScale(1.04);
    });

    background.on("pointerout", () => {
      background.setFillStyle(0x18202b);
      background.setScale(1);
    });

    background.on("pointerdown", () => {
      onSelect(upgrade);
    });

    cardContainer.add([
      background,
      nameText,
      descriptionText,
    ]);

    return cardContainer;
  }

  destroy(): void {
    this.container.destroy(true);
  }
}