
class ShipSprite extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'ship_manned');
    this.game.stage.addChild(this);
    this.scale.setTo(0.3);
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.body.gravity.y = 10;
    this.body.gravity.x = 1;

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 1.01;
    this.anchor.setTo(0.4);

    // this.game.add.tween(this).to({y: 700}, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
  }
}

export default ShipSprite;