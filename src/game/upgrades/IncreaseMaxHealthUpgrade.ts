import { Player } from "../entities/Player";
import { Upgrade } from "./Upgrade";

export class IncreaseMaxHealthUpgrade implements Upgrade {
  readonly id = "increase-max-health";
  readonly name = "Núcleo Reforçado";
  readonly description = "Aumenta a vida máxima em 25.";

  apply(player: Player): void {
    player.increaseMaxHealth(25);
  }
}