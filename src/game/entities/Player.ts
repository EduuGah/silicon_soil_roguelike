import { Input, Math as PhaserMath, Scene } from "phaser";

import { BasicWeapon } from "../weapons/BasicWeapon";
import { Projectile } from "./Projectile";
import { Entity } from "./Entity";

export class Player extends Entity {
  private readonly teclaD: Input.Keyboard.Key;
  private readonly teclaA: Input.Keyboard.Key;
  private readonly teclaW: Input.Keyboard.Key;
  private readonly teclaS: Input.Keyboard.Key;

  private level = 1;
  private currentXp = 0;
  private xpToNextLevel = 100;

  private readonly teclaSpace: Input.Keyboard.Key;
  private readonly teclaF: Input.Keyboard.Key;

  private readonly weapon: BasicWeapon;

  private readonly diagonalMultiplier = 1 / Math.sqrt(2);

  private readonly invulnerabilityDuration = 800;
  private readonly knockbackForce = 80;

  private invulnerable = false;

  constructor(scene: Scene) {
    super(scene, 512, 384, 64, 64, 0x00ff88, 100, 250, 10);

    if (!scene.input.keyboard) {
      throw new Error("Teclado indisponível.");
    }

    this.teclaD = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.D);
    this.teclaA = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.A);
    this.teclaW = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.W);
    this.teclaS = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.S);
    this.teclaSpace = scene.input.keyboard.addKey(
      Input.Keyboard.KeyCodes.SPACE,
    );
    this.teclaF = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.F);

    this.weapon = new BasicWeapon(scene);
  }

  update(delta: number): void {
    let directionX = 0;
    let directionY = 0;

    if (this.teclaD.isDown) directionX++;
    if (this.teclaA.isDown) directionX--;

    if (this.teclaS.isDown) directionY++;
    if (this.teclaW.isDown) directionY--;

    if (directionX !== 0 && directionY !== 0) {
      directionX *= this.diagonalMultiplier;
      directionY *= this.diagonalMultiplier;
    }

    const deltaSeconds = delta / 1000;

    this.body.x += directionX * this.speed * deltaSeconds;
    this.body.y += directionY * this.speed * deltaSeconds;

    this.applyScreenLimits();

    // TESTES (remover depois)

    if (Input.Keyboard.JustDown(this.teclaSpace)) {
      this.takeDamage(10);
    }

    if (Input.Keyboard.JustDown(this.teclaF)) {
      this.heal(10);
    }
  }

  public override takeDamage(amount: number): void {
    if (this.invulnerable || this.isDead()) {
      return;
    }

    super.takeDamage(amount);

    this.invulnerable = true;

    this.body.setAlpha(0.4);

    this.scene.time.delayedCall(this.invulnerabilityDuration, () => {
      this.invulnerable = false;
      this.body.setAlpha(1);
    });
  }

  shoot(
    targetX: number,
    targetY: number,
    currentTime: number,
  ): Projectile | null {
    return this.weapon.shoot(
      this.getX(),
      this.getY(),
      targetX,
      targetY,
      currentTime,
    );
  }

  public takeContactDamage(
    amount: number,
    sourceX: number,
    sourceY: number,
  ): void {
    if (this.invulnerable || this.isDead()) {
      return;
    }

    this.takeDamage(amount);

    const direction = new PhaserMath.Vector2(
      this.body.x - sourceX,
      this.body.y - sourceY,
    );

    direction.normalize();

    this.body.x += direction.x * this.knockbackForce;
    this.body.y += direction.y * this.knockbackForce;

    this.applyScreenLimits();
  }

  private applyScreenLimits(): void {
    const halfWidth = this.body.width / 2;
    const halfHeight = this.body.height / 2;

    this.body.x = PhaserMath.Clamp(
      this.body.x,
      halfWidth,
      this.scene.scale.width - halfWidth,
    );

    this.body.y = PhaserMath.Clamp(
      this.body.y,
      halfHeight,
      this.scene.scale.height - halfHeight,
    );
  }

  gainXp(amount: number): void {
    if (amount <= 0) {
      return;
    }

    this.currentXp += amount;
    this.checkLevelUp();
  }

  private checkLevelUp(): void {
    while (this.currentXp >= this.xpToNextLevel) {
      this.currentXp -= this.xpToNextLevel;
      this.level++;
      this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.25);
    }
  }

  getLevel(): number {
    return this.level;
  }

  getCurrentXp(): number {
    return this.currentXp;
  }

  getXpToNextLevel(): number {
    return this.xpToNextLevel;
  }
}
