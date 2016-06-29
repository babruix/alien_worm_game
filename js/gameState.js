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

    this.jumpTimer = 0;
    this.activeControl = 'player';
  },

  preload: function () {
    // Player
    this.game.load.image('worm', 'assets/worm.png');
    this.game.load.image('alien', 'assets/alien.png');
    this.game.load.image('alien', 'assets/p1_spritesheet.png');

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

    game.load.tilemap('map', 'assets/maps/collision test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('kenney', 'assets/tilemaps/tiles/kenney.png');
  },

  create: function () {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.stage.backgroundColor = '#2d2d2d';

    this.map = game.add.tilemap('map');

    this.map.addTilesetImage('ground_1x1');
    this.map.addTilesetImage('kenney');

    this.layer = this.map.createLayer('Tile Layer 1');
    // this.layer.debug = true;
    this.layer.resizeWorld();

    //  Set the tiles for collision.
    //  Do this BEFORE generating the p2 bodies below.
    this.map.setCollisionBetween(1, 100);

    //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
    //  This call returns an array of body objects which you can perform addition actions on if
    //  required. There is also a parameter to control optimising the map build.
    game.physics.p2.convertTilemap(this.map, this.layer);

    game.physics.p2.restitution = 0.5;
    game.physics.p2.gravity.y = 900;

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.game.time.desiredFps = 30;

    // Game elemtnts

    // Player
    this.player = this.game.add.sprite(100, 100, 'alien');
    this.player.scale.setTo(0.03);
    game.physics.p2.enable(this.player);
    this.player.body.fixedRotation = true;
    game.camera.follow(this.player);

    // Worm
    this.worm = this.game.add.sprite(0, 500, 'worm');
    this.worm.scale.setTo(0.05);
    this.game.physics.p2.enable(this.worm);
    this.worm.body.bounce.y = 0.2;

    // Artifact
    this.artifact = this.game.add.sprite(200, 200, 'artifact');
    this.artifact.scale.setTo(0.05);
    this.game.physics.p2.enable(this.artifact);

    // Bird: attacks a worm
    this.bird = this.game.add.sprite(300, 0, 'bird');
    this.bird.scale.setTo(0.05);
    this.game.physics.p2.enable(this.bird);
    this.bird.body.allowRotation = false;

    // Bones: use to some shit
    this.bones = this.game.add.sprite(500, 200, 'bones');
    this.bones.scale.setTo(0.05);
    this.game.physics.p2.enable(this.bones);

    // Crystals: use for ufo ?
    this.crystals = this.game.add.sprite(600, 0, 'crystals');
    this.crystals.scale.setTo(0.05);
    this.game.physics.p2.enable(this.crystals);

    // Fruit tree use to produce fruits to eat
    this.fruittree = this.game.add.sprite(700, 200, 'fruittree');
    this.fruittree.scale.setTo(0.05);
    this.fruittree.anchor.setTo(0.5, 1);
    this.fruittree.angle = -30;
    this.game.physics.p2.enable(this.fruittree);

    // Stone: should be movable
    this.stone = this.game.add.sprite(100, 500, 'stone');
    this.game.physics.p2.enable(this.stone);
    this.stone.scale.setTo(0.05);
    this.stone.anchor.setTo(0.5);

    // Ufo: just flying aroung
    this.ufo = this.game.add.sprite(200, 500, 'ufo');
    this.game.physics.p2.enable(this.ufo);
    this.ufo.scale.setTo(0.05);

    /*
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
  */
  },

  update: function () {
    // Collide bird with worm
    this.game.physics.arcade.collide(this.bird, this.worm);

    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.player.body.moveLeft(300);
    }
    else if (this.cursors.right.isDown) {
      this.player.body.moveRight(300);
    }

    if (this.cursors.up.isDown
      && AlienGame.prototype.checkIfCanJump(this.player)
      && this.game.time.now > this.jumpTimer) {

      this.player.body.moveUp(400);
      this.jumpTimer = this.game.time.now + 750;
    }

  },

  checkIfCanJump: function (player) {
    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;

    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
      var c = game.physics.p2.world.narrowphase.contactEquations[i];

      if (c.bodyA === player.body.data || c.bodyB === player.body.data) {
        var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
        if (c.bodyA === player.body.data) d *= -1;
        if (d > 0.5) result = true;
      }
    }

    return result;
  }

};
