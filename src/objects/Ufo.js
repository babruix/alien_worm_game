
class UfoSprite extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'ufo');
    this.game.stage.addChild(this);

    this.scale.setTo(0.5);
    this.anchor.setTo(0.5);
    this.animations.add('grow', [3, 2, 1, 0]);
    this.animations.play('grow', 10, true);

    game.physics.arcade.enable(this);

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 1.01;
    // this.body.gravity.y = 2000;

    game.add.tween(this).to({x: 300}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
  }
}

export default UfoSprite;