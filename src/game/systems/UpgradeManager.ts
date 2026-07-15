import { Math as PhaserMath } from "phaser";

import { Upgrade } from "../upgrades/Upgrade";
import { IncreaseSpeedUpgrade } from "../upgrades/IncreaseSpeedUpgrade";
import { IncreaseDamageUpgrade } from "../upgrades/IncreaseDamageUpgrade";
import { IncreaseMaxHealthUpgrade } from "../upgrades/IncreaseMaxHealthUpgrade";

export class UpgradeManager {
  private readonly upgrades: Upgrade[] = [
    new IncreaseSpeedUpgrade(),
    new IncreaseDamageUpgrade(),
    new IncreaseMaxHealthUpgrade(),
  ];

  getRandomChoices(quantity: number): Upgrade[] {
    if (quantity <= 0) {
      return [];
    }

    const pool = [...this.upgrades];
    const choices: Upgrade[] = [];

    const amountToChoose = Math.min(quantity, pool.length);

    for (let index = 0; index < amountToChoose; index++) {
      const randomIndex = PhaserMath.Between(
        0,
        pool.length - 1,
      );

      const selectedUpgrade = pool[randomIndex];

      choices.push(selectedUpgrade);
      pool.splice(randomIndex, 1);
    }

    return choices;
  }
}