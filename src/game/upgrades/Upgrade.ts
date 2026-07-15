import { Player } from "../entities/Player";

export interface Upgrade {
  readonly id: string;
  readonly name: string;
  readonly description: string;

  apply(player: Player): void;
}