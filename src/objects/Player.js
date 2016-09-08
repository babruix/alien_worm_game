// import Phaser.SPRITE from 'Phaser.SPRITE';
import Main from 'states/Main';

import HealthBar from "../plugins/HealthBar";

class Player extends Phaser.Sprite {

	constructor(game, x, y) {
    super(game, x, y, 'player');
    this.frame = 4;
    this.animations.add('walk', [0, 1, 2, 3], 10, true);
    this.animations.add('jump', [12, 13, 14], 10, true);

    this.scale.set(0.6);
    this.anchor.setTo(0.5, 0);
		game.add.existing(this);

    game.physics.arcade.enable(this);
    this.jumpTimer = 0;
		this.body.collideWorldBounds = true;

    this.body.bounce.y = 0.2;
    this.body.gravity.y = 1500;
    this.body.velocity.x = 100;

    var barConfig = {x: 300, y: 50};
    this.healthBar = new HealthBar(this.game, barConfig);
    this.healthBar.setFixedToCamera(true);

    this.myAudio = game.add.audio('myAudio');
    this.lastHeartTime = this.game.time.now;
  }

	update () {
    this.health = this.health - 0.001;
    this.healthBar.setPercent(this.health * 10);
    if (this.health < 2) {
      if (!this.healthBar.blinkTween) {
        this.healthBar.blinkTween = this.game.add.tween(this.healthBar.barSprite)
        .to({alpha:0}, 200, Phaser.Easing.Exponential.InOut, true, 0, -1, true);
      }
    }
    else if (this.healthBar.blinkTween) {
      this.healthBar.blinkTween.stop();
      this.healthBar.barSprite.alpha = 1;
      this.healthBar.blinkTween = null;
    }
  }

  takeBox(player, box) {
    this.boxTween = this.game.add.tween(box);
    this.boxTween.to({y: box.y-box.height*2, alpha: 1}, 100, Phaser.Easing.Linear.Out, true);
    this.boxTween.onComplete.add(function(obj) {
      box.kill();
    }, this);
  }

  static eatCherry(player, cherry) {
    if (cherry.alive) {
      player.health++;
      cherry.kill();
      // player.myAudio.play();
    }
  }

	move(cursors) {
		const acceleration = 200;

		if (cursors.left.isDown) {
      this.scale.setTo(-0.6, 0.6);
      this.animations.play('walk', 20, true);
      this.body.velocity.x = -acceleration;
    } else if (cursors.right.isDown) {
      this.body.velocity.x = acceleration;
      this.scale.setTo(0.6, 0.6);
      this.animations.play('walk', 20, true);
    } else {
      this.body.velocity.x = 0;
      this.animations.stop('walk');
      this.frame = 4;
    }

    if (cursors.up.isDown
      && (this.body.onFloor() || this.locked)
      && this.game.time.now > this.jumpTimer) {
      this.body.velocity.y -= 600;
      this.jumpTimer = this.game.time.now + 750;
    }
	}

  hitLadder(sprite, tile) {
    sprite.body.velocity.y = this.cursors.up.isDown ? -150 : 0;
    if (this.cursors.down.isDown) {
      sprite.body.velocity.y = 100;
    }
  }

  hitLava() {
    this.game.camera.shake(0.005, 70);
    this.health -= 0.1;
  }

  // Note: 'this' here is context from Main!
  platformsLockPlayer(){
    this.game.physics.arcade.collide(this.playerObject, this.verticalplatformsGroup, Main.platformSep, null, this);
    this.game.physics.arcade.collide(this.playerObject, this.horizontalPlatformsGroup, Main.platformSep, null, this);
    if (this.playerObject.locked) {
      if (this.playerObject.body.right < this.playerObject.lockedTo.body.x || this.playerObject.body.x > this.playerObject.lockedTo.body.right) {
        this.playerObject.locked = false;
        this.playerObject.lockedTo = null;
      } else {
        this.playerObject.x += this.playerObject.lockedTo.deltaX;
        this.playerObject.y += this.playerObject.lockedTo.deltaY;
      }
    }
  }
}

export default Player;
