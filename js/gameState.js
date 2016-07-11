var AlienGame = function (game) {
  this.game = game;
  this.tabLastTime = game.time.now();
  this.worm = null;
  this.player = null;
};

AlienGame.prototype = {
  init: function () {
    // Set scale options
    game.input.maxPointers = 1; // No multi-touch
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    this.jumpTimer = 0;
    this.currentlyControlling = 'player';
  },

  render: function () {
    this.game.debug.start(20, 20, 'yellow');
    this.game.debug.line();
    // Sprite debug info
    // this.game.debug.spriteInfo(AlienGame._UiGroup.children[0], 32, 32);
    // console.log(AlienGame.prototype.currentlyControlling);
    // this.game.debug.spriteInfo(AlienGame.prototype.currentlyControlling.key, 32, 32);
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
    game.load.spritesheet('player', 'assets/p1_spritesheet.png', 73, 96, 16);
    this.game.load.spritesheet('slimeWalk', 'assets/slimeWalk.png', 50, 28);

  },

  createTileMap: function () {
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
  },

  switchPlayer: function (worm, player) {
    if (AlienGame.currentlyControlling == 'player') {
      AlienGame.currentlyControlling = 'worm';
      game.camera.follow(worm);
    }
    else {
      AlienGame.currentlyControlling = 'player';
      game.camera.follow(player);
    }
  },

  create: function () {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.stage.backgroundColor = '#2d2d2d';
    AlienGame.prototype.createTileMap();

    game.physics.p2.restitution = 0.5;
    game.physics.p2.gravity.y = 900;

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.tabButton = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    this.tabButton.onDown.add(function () {
      // if (game.time.now > AlienGame.tabLastTime + 1000) {
      // alert(1);
        AlienGame.tabLastTime = game.time.now + 1000;
        AlienGame.prototype.switchPlayer(this.worm, this.player);
      // }
    }, this);
    this.game.time.desiredFps = 30;

    // Game elemtnts

    // Player
    this.player = game.add.sprite(100, 100, 'player');
    this.player.frame = 4;
    this.player.animations.add('walk', [0, 1, 2, 3], 10, true);
    this.player.animations.add('jump', [12, 13, 14], 10, true);

    this.player.scale.set(0.6);
    game.physics.p2.enable(this.player);
    this.player.body.fixedRotation = true;

    this.slime = game.add.sprite(100, 100, 'slimeWalk');
    this.slime.animations.add('walk', [0,1],10, true);
    this.slime.animations.play('walk', true);


    // Worm
    this.worm = this.game.add.sprite(0, 500, 'worm');
    this.worm.scale.setTo(0.05);
    this.game.physics.p2.enable(this.worm);
    // this.worm.body.bounce.y = 0.2;
    this.worm.body.fixedRotation = true;
    AlienGame.currentlyControlling = 'player';
    game.camera.follow(this.player);

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
    this.stone.scale.setTo(0.05);
    this.stone.anchor.setTo(0.5);
    this.game.physics.p2.enable(this.stone);

    // Ufo: just flying aroung
    this.ufo = this.game.add.sprite(200, 500, 'ufo');
    this.ufo.scale.setTo(0.05);
    this.game.physics.p2.enable(this.ufo);
    // this.addAnimations();
    AlienGame._UiGroup = game.add.group();
    AlienGame._UiGroup.fixedToCamera = true;
    AlienGame._UiGraph = AlienGame.prototype.createUiGraph(this.game);
    AlienGame._UiGroup.add(AlienGame._UiGraph);
  },

  update: function () {
    // Collide bird with worm
    this.game.physics.arcade.collide(this.bird, this.worm);

    this.player.body.velocity.x = 0;
    this.worm.body.velocity.x = 0;

    if ('player' == AlienGame.currentlyControlling) {
      // Move player
      if (this.cursors.left.isDown) {
        this.player.scale.setTo(-0.6, 0.6);
        this.player.body.moveLeft(300);
        this.player.animations.play('walk', 20, true);
      }
      else if (this.cursors.right.isDown) {
        this.player.scale.setTo(0.6, 0.6);
        this.player.body.moveRight(300);
        this.player.animations.play('walk', 20, true);
      }
      else {
        this.player.animations.stop('walk');
        this.player.frame = 4;
      }

      if (this.cursors.up.isDown
        && AlienGame.prototype.checkIfCanJump(this.player)
        && this.game.time.now > this.jumpTimer) {
        this.player.animations.play('jump', 10);
        this.player.body.moveUp(400);
        this.jumpTimer = this.game.time.now + 750;
      }
      if (!AlienGame.prototype.checkIfCanJump(this.player)) {
        this.player.animations.stop('jump');
      }
      AlienGame._UiGroup.children[0].x = this.player.x;
      AlienGame._UiGroup.children[0].y = this.player.y;
      // @todo: eat plants, pickup items, move stone...
    }
    else {
      // Move worm
      if (this.cursors.left.isDown) {
        this.worm.body.moveLeft(300);
        this.worm.scale.setTo(0.05);
        this.worm.angle = 0;
      }
      else if (this.cursors.right.isDown) {
        this.worm.body.moveRight(300);
        this.worm.scale.setTo(-0.05, 0.05);
        this.worm.angle = 0;
      }
      if (this.cursors.down.isDown) {
        this.worm.scale.setTo(0.05);
        this.worm.body.moveDown(300);
        this.worm.angle = 270;
      }
      else if (this.cursors.up.isDown){
        this.worm.scale.setTo(0.05);
        this.worm.body.moveUp(300);
        this.worm.angle = 90;
      }
      AlienGame._UiGroup.children[0].x = this.worm.x;
      AlienGame._UiGroup.children[0].y = this.worm.y;
      // @todo: eat ground...
    }

  },

  createUiGraph: function(game) {
    var uiRect = game.add.graphics(0, 0);
    uiRect.beginFill(0xFFFFFF);
    uiRect.drawRect(0, 0, 60, 15);
    uiRect.alpha = 0.5;
    return uiRect;
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
  },

  addAnimations: function () {
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

  }

};
