import { Player } from "../entities/Player";
import { Upgrade } from "./Upgrade";

export class ReduceWeaponCooldownUpgrade implements Upgrade {
  readonly id = "reduce-weapon-cooldown";
  readonly name = "Tempo de Recarga Reduzido";
  readonly description = "Reduz o tempo de recarga da arma em 5%.";

  apply(player: Player): void {
    player.reduceWeaponCooldown(0.05);
  }
}