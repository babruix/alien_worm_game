class ArrowSprite extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'arrow');

    this.game.stage.addChild(this);
    this.scale.set(0.2);
    this.alpha = 0.5;
    this.anchor.setTo(0.5, 1.3);
    this.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 30, true);
    this.animations.play('rotate', 30, true);
    this.currentlyControlling = 'player';
  }

  updatePosition(playerObject, wormObject) {

    this.x = this.currentlyControlling === 'player'
      ? playerObject.x
      : wormObject.x;
    this.x -= this.game.camera.x; // Shift with camera position

    this.y = this.currentlyControlling === 'player'
      ? playerObject.y
      : wormObject.y;
  }

  static switchPlayer () {
    if (this.tabButton.arrow.currentlyControlling === 'player') {
      this.tabButton.arrow.currentlyControlling = 'worm';
      this.game.camera.follow(this.wormObject);
    }
    else {
      this.tabButton.arrow.currentlyControlling = 'player';
      this.game.camera.follow(this.playerObject);
    }
  }
}

export default ArrowSprite;