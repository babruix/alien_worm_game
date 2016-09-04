import Cherry from "../objects/Cherry";
class TreeSprite extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'tree');
    game.stage.addChild(this);

    this.y = 450;
    this.x = this.game.rnd.integerInRange(0, 500);
    this.initialX = this.x;

    this.scale.setTo(0.5);
    this.animationFinished = false;
    this.countCherries = 6;
    this.animations.add('grow', [3, 2, 1, 0]);
    this.animations.play('grow', 1, false)
      .onComplete.add(this.plantCherries, this);
  }

  update() {
    // Shift according camera position
    this.x = this.game.camera.x > 0
      ? this.initialX - this.game.camera.x
      : this.initialX;
  }

  plantCherries() {
    Array.from(new Array(this.countCherries), (x, i) => {
      this.game.time.events.add(Phaser.Timer.SECOND * i, this.addCherry, this);
    });
  }

  addCherry() {
    var x = this.game.rnd.integerInRange(30, 70);
    var y = this.game.rnd.integerInRange(20, 60);
    let cherry = new Cherry(this.game, x, y);
    this.addChild(cherry);
    this.game.time.events.add(Phaser.Timer.SECOND, ()=>cherry.alpha = 1, this);

    if (this.children.length == this.countCherries) {
      this.game.time.events.add(Phaser.Timer.SECOND * this.countCherries, this.setAnimationFinished, this);
    }
  }

  setAnimationFinished() {
    this.animationFinished = true;
  }

  countCherriesAlive() {
    let countAlive = 0;
    this.children.forEach(function (cherry) {
      if (cherry.alive) {
        countAlive++;
      }
    });

    return countAlive;
  }

  // Note: 'this' here is context from Main!
  checkAllCherriesEaten() {
    if (!this.tree.animationFinished || this.tree.countCherriesAlive() !== 0) {
      return false;
    }

    this.tree.animationFinished = false;
    this.tree.kill();
    return true;
  }
}

export default TreeSprite;