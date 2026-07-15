import { Player } from "../entities/Player";
import { Upgrade } from "./Upgrade";

export class IncreaseSpeedUpgrade implements Upgrade {
  readonly id = "increase-speed";
  readonly name = "Circuitos Acelerados";
  readonly description = "Aumenta a velocidade de movimento em 20.";

  apply(player: Player): void {
    player.increaseSpeed(20);
  }
}