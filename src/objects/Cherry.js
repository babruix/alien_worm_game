
class CherrySprite extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'cherry');
    this.game.stage.addChild(this);
    this.alpha = 0;
    this.scale.setTo(0.7);
    this.anchor.setTo(0.5, 0);
    this.angle = -30;
    game.physics.arcade.enable(this);
    game.add.tween(this).to({angle: 30}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
  }
}

export default CherrySprite;