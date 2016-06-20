var AlienGame = function (game) {
  this.game = game;
};

AlienGame.prototype = {
  init: function () {
    // Set scale options
    game.input.maxPointers = 1; // No multi-touch
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    this.jumpTimer = this.game.time.now;
  },

  preload: function () {
    // Player
    this.game.load.image('worm', 'assets/worm.png');
    this.game.load.image('alien', 'assets/alien.png');

    // Enemies
    this.game.load.image('bird', 'assets/bird.png');
    this.game.load.image('bug', 'assets/bug.png');
    this.game.load.image('ufo', 'assets/ufo.png');

    // Pickups
    this.game.load.image('artifact', 'assets/artifact-mysterious-cube.png');
    this.game.load.image('bones', 'assets/bones.png');
    this.game.load.image('crystals', 'assets/crystals.png');
    this.game.load.image('fruittree', 'assets/fruittree.png');
    this.game.load.image('stone', 'assets/stone.png');

    this.game.load.image('background', 'assets/background2.png');
  },

  create: function () {

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.desiredFps = 30;
    this.game.physics.arcade.gravity.y = 1500;
    this.game.add.tileSprite(0, 0, 800, 600, 'background');

    // Game elemtnts

    // Player
    this.player = this.game.add.sprite(100, 100, 'alien');
    this.player.scale.setTo(0.05);
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.bounce.y = 0.2;
    this.player.body.mass = 1000;
    this.player.body.collideWorldBounds = true;

    // Worm
    this.worm = this.game.add.sprite(0, 0, 'worm');
    this.worm.scale.setTo(0.05);
    this.game.physics.enable(this.worm, Phaser.Physics.ARCADE);
    this.worm.body.bounce.y = 0.2;
    this.worm.body.collideWorldBounds = true;

    this.wormAnimat = this.game.add.tween(this.worm);
    this.wormAnimat.to({x: this.worm.x+100}, 500, Phaser.Easing.Linear.InOut, true, 1000, 3, true);


    // Artifact
    this.artifact = this.game.add.sprite(200, 200, 'artifact');
    this.artifact.scale.setTo(0.05);
    this.game.physics.enable(this.artifact, Phaser.Physics.ARCADE);
    this.artifact.body.collideWorldBounds = true;

    // Bird: attacks a worm
    this.bird = this.game.add.sprite(300, 0, 'bird');
    this.bird.scale.setTo(0.05);
    this.game.physics.enable(this.bird, Phaser.Physics.ARCADE);
    this.bird.body.collideWorldBounds = true;
    this.bird.body.allowRotation = false;

    // Bones: use to some shit
    this.bones = this.game.add.sprite(500, 200, 'bones');
    this.bones.scale.setTo(0.05);
    this.game.physics.enable(this.bones, Phaser.Physics.ARCADE);
    this.bones.body.collideWorldBounds = true;

    // Crystals: use for ufo ?
    this.crystals = this.game.add.sprite(600, 0, 'crystals');
    this.crystals.scale.setTo(0.05);
    this.game.physics.enable(this.crystals, Phaser.Physics.ARCADE);
    this.crystals.body.collideWorldBounds = true;

    // Fruit tree use to produce fruits to eat
    this.fruittree = this.game.add.sprite(700, 200, 'fruittree');
    this.game.physics.enable(this.fruittree, Phaser.Physics.ARCADE);
    this.fruittree.body.collideWorldBounds = true;
    this.fruittree.scale.setTo(0.05);
    this.fruittree.anchor.setTo(0.5, 1);
    this.fruittree.angle = -30;

    // Stone: should be movable
    this.stone = this.game.add.sprite(100, 500, 'stone');
    this.game.physics.enable(this.stone, Phaser.Physics.ARCADE);
    this.stone.body.collideWorldBounds = true;
    this.stone.scale.setTo(0.05);
    this.stone.anchor.setTo(0.5);

    // Ufo: just flying aroung
    this.ufo = this.game.add.sprite(200, 500, 'ufo');
    this.game.physics.enable(this.ufo, Phaser.Physics.ARCADE);
    this.ufo.body.collideWorldBounds = true;
    this.ufo.scale.setTo(0.05);

    this.ufoTween = this.game.add.tween(this.ufo);
    this.ufoTween.to({y: 200}, 3000, Phaser.Easing.Bounce.In, true, 1000, 2, true);

    this.crystalsTween = this.game.add.tween(this.crystals);
    this.crystalsTween.to({alpha: 0}, 2000, Phaser.Easing.Power2.InOut, true, 1000, 4, true);

    this.treeTween = this.game.add.tween(this.fruittree);
    this.treeTween.to({angle: 30}, 5000, Phaser.Easing.Sinusoidal.InOut, true, 1000, 19, true);

    this.stoneTween = this.game.add.tween(this.stone);
    this.stoneTween.to({
      width: 0.5,
      height: 0.5
    }, 500, Phaser.Easing.Sinusoidal.InOut, true, 1000, 2, true);

  },

  update: function () {
    // Collide bird with worm
    this.game.physics.arcade.collide(this.bird, this.worm);

    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -500;
    }
    else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 500;
    }

    if (this.cursors.up.isDown
      && this.player.body.onFloor()
      && this.game.time.now > this.jumpTimer) {

      this.player.body.velocity.y = -500;
      this.jumpTimer = this.game.time.now + 750;
    }

  }

};

function getWidth() {
  if (self.innerHeight) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}