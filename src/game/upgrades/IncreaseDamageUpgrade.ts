import { Player } from "../entities/Player";
import { Upgrade } from "./Upgrade";

export class IncreaseDamageUpgrade implements Upgrade {
  readonly id = "increase-damage";
  readonly name = "Pulso Amplificado";
  readonly description = "Aumenta o dano dos projéteis em 5.";

  apply(player: Player): void {
    player.increaseWeaponDamage(5);
  }
}