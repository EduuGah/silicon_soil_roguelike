import { GameObjects, Scene } from "phaser";
import { Player } from "../entities/Player";
import { WaveManager } from "../systems/WaveManager";

export class DebugHUD {
  private readonly playerPositionText: GameObjects.Text;
  private readonly playerHealthText: GameObjects.Text;
  private readonly waveText: GameObjects.Text;
  private readonly enemiesText: GameObjects.Text;

  private readonly levelText: GameObjects.Text;
  private readonly xpText: GameObjects.Text;

  private readonly damageText: GameObjects.Text;
  private readonly speedText: GameObjects.Text;

  constructor(
    scene: Scene,
    private readonly player: Player,
    private readonly waveManager: WaveManager,
  ) {
    scene.add.text(20, 10, "Debug HUD", {
      fontSize: "16px",
      color: "#ffffff",
    });

    this.playerPositionText = scene.add.text(20, 30, "", {
      fontSize: "14px",
      color: "#ffffff",
    });

    this.playerHealthText = scene.add.text(20, 50, "", {
      fontSize: "14px",
      color: "#ffffff",
    });

    this.waveText = scene.add.text(20, 70, "", {
      fontSize: "14px",
      color: "#ffffff",
    });

    this.enemiesText = scene.add.text(20, 90, "", {
      fontSize: "14px",
      color: "#ffffff",
    });

    this.levelText = scene.add.text(20, 110, "", {
      fontSize: "14px",
      color: "#ffffff",
    });

    this.xpText = scene.add.text(20, 130, "", {
      fontSize: "14px",
      color: "#ffffff",
    });

    this.damageText = scene.add.text(20, 150, "", {
      fontSize: "14px",
      color: "#ffffff",
    });

    this.speedText = scene.add.text(20, 170, "", {
      fontSize: "14px",
      color: "#ffffff",
    });
  }

  update(): void {
    this.playerPositionText.setText(
      `Player Position: (${Math.round(this.player.getX())}, ${Math.round(this.player.getY())})`,
    );

    this.playerHealthText.setText(
      `Player Health: ${this.player.getHealth()}/${this.player.getMaxHealth()}`,
    );

    this.waveText.setText(`Wave: ${this.waveManager.getCurrentWave()}`);

    this.enemiesText.setText(
      `Enemies: ${this.waveManager.getEnemies().length}`,
    );

    this.levelText.setText(`Level: ${this.player.getLevel()}`);

    this.xpText.setText(
      `XP: ${this.player.getCurrentXp()}/${this.player.getXpToNextLevel()}`,
    );

    this.damageText.setText(`Damage: ${this.player.getWeaponDamage()}`);
    this.speedText.setText(`Speed: ${this.player.getSpeed()}`);
  }
}
