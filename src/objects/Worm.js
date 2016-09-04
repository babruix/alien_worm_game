class Worm extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'worm');

    this.scale.set(0.19);
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('walk', [0, 0, 1, 1], 5, true);

    game.add.existing(this);
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.fixedRotation = true;

    this.animations.play('walk', 20, true);

    this.y = 800;
  }

  move(cursors, map, layer) {
    const acceleration = 200;

    if (cursors.left.isDown) {
      this.scale.setTo(0.19);
      this.angle = 0;
      this.animations.play('walk', 20, true);
      this.body.velocity.x = (-acceleration);
    }
    else if (cursors.right.isDown) {
      this.scale.setTo(-0.19, 0.19);
      this.body.velocity.x = (acceleration);
      this.angle = 0;
      this.animations.play('walk', 20, true);
    }
    else if (cursors.down.isDown) {
      this.scale.setTo(0.19);
      this.body.velocity.y = (300);
      this.angle = 270;
      this.animations.play('walk', 20, true);
    }
    else if (cursors.up.isDown) {
      this.scale.setTo(0.19);
      this.body.velocity.y = (-300);
      this.angle = 90;
      this.animations.play('walk', 20, true);
    }
    else {
      this.body.velocity.y = 0;
      this.body.velocity.x = 0;
      this.animations.stop('walk');
      this.frame = 0;
    }
    if (this.y < 600) {
      this.y = 600;
    }
  }

  static digGroud(worm, ground) {
    ground.kill();
  }
}

export default Worm;
