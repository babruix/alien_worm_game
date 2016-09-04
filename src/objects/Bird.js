
class BirdSprite extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'bird');
    this.game.stage.addChild(this);
    this.scale.setTo(0.3);
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.body.gravity.y = 10;
    this.body.gravity.x = 1;

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0.8;
    this.anchor.setTo(0.4);
    this.animations.add('fly', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 2);
    this.animations.play('fly', 60, true);
    this.lastHeartTime = this.game.time.now;
  }

  update() {
    if (this.body.velocity.x < 0) {
      if (this.scale.x > 0) {
        this.scale.x *= -1;
      }
    }
    else {
      if (this.scale.x < 0) {
        this.scale.x *= -1;
      }
    }
  }


  // Note: 'this' here is context from Main!
  moveToTree() {
    if (this.game.physics.arcade.distanceBetween(this.bird, this.tree) > 15) {
      this.game.physics.arcade.moveToObject(this.bird, this.tree, 200);
    }
    else {
      this.bird.eatCherry(this.bird, this.tree);
    }
  }

  eatCherry(bird, tree) {
    if (tree.countCherriesAlive() > 0) {
      tree.children.forEach(function (cherry) {
        if (cherry.alive) {
          cherry.kill();
          bird.health++;
        }
      });
    }
  }
}

export default BirdSprite;