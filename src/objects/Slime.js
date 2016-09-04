
class SlimeSprite extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'slime_walk');
    this.game.stage.addChild(this);
    this.scale.setTo(0.8);
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.body.allowGravity = false;
    this.anchor.setTo(0.5);

    this.animations.add('walk', [0, 1], 10, true);
    this.animations.play('walk', true);

    // this.game.add.tween(this).to({y: 700}, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
  }

  moveToWorm() {
    this.game.physics.arcade.moveToObject(this.slime, this.wormObject, 150);
  }
}

export default SlimeSprite;