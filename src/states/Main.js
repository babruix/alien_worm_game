import Player from 'objects/Player';
import Worm from "../objects/Worm";
import Arrow from "../objects/Arrow";
import Tree from "../objects/Tree";
import Ufo from "../objects/Ufo";
import Bird from "../objects/Bird";
import Slime from "../objects/Slime";
import Ship from "../objects/Ship";

class Main extends Phaser.State {

  create() {
    this.hasGreenKey = false;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = '#232323';
    this.game.time.desiredFps = 30;

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.createTileMap();

    this.playerObject = new Player(this.game);
    this.map.setTileIndexCallback([161, 140], this.playerObject.hitLadder, this);
    this.game.camera.follow(this.playerObject);
    this.wormObject = new Worm(this.game);

    this.tabButton = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    this.tabButton.arrow = new Arrow(this.game);
    this.tabButton.onDown.add(Arrow.switchPlayer, this);

    this.addNewTree();
    this.tree.cherries = this.game.add.group();
    this.groundGroup = this.game.add.group();
    this.boxGroup = this.game.add.group();
    this.verticalplatformsGroup = this.game.add.group();
    this.horizontalPlatformsGroup = this.game.add.group();
    this.lockerGroup = this.game.add.group();
    this.groundGroup.enableBody = true;
    this.boxGroup.enableBody = true;
    this.verticalplatformsGroup.enableBody = true;
    this.horizontalPlatformsGroup.enableBody = true;
    this.lockerGroup.enableBody = true;

    // And now we convert all of the ground objects with an ID of 59 into sprites within the ground group
    this.map.createFromObjects('Object Layer 1', 59, 'ground', 0, true, false, this.groundGroup);
    this.map.createFromObjects('Object Layer 1', 109, 'box_warn', 0, true, false, this.boxGroup);
    this.map.createFromObjects('Object Layer 1', 150, 'box_orange', 0, true, false, this.boxGroup);
    this.map.createFromObjects('Object Layer 1', 108, 'box_circle', 0, true, false, this.boxGroup);
    this.map.createFromObjects('Object Layer 1', 58, 'green_platform', 0, true, false, this.verticalplatformsGroup);
    this.map.createFromObjects('Object Layer 1', 58, 'green_platform', 0, true, false, this.horizontalPlatformsGroup);
    this.map.createFromObjects('Object Layer 1', 118, 'locker', 0, true, false, this.lockerGroup);
    this.lockerGroup.setAll('body.immovable', true);

    this.enablePlatforms();
    // this.bird = new Bird(this.game, 800, 50);

    /*
     this.ufo = new Ufo(this.game, 100, 50);
     this.ship = new Ship(this.game, 200,200);
     this.slime = new Slime(this.game, 100, 700);
     let mush = this.game.add.sprite(150, 515, 'mushroom_red');
     mush.scale.setTo(0.5);

     let cryst = this.game.add.sprite(500, 415, 'crystals');
     cryst.scale.setTo(0.4);
     cryst.animations.add('glow', [2, 1, 0]);
     cryst.animations.play('glow', 10, true);*/
  }

  enablePlatforms() {
    this.verticalplatformsGroup.forEach(function (p) {
      this.game.physics.enable(p, Phaser.Physics.ARCADE);
      p.body.allowGravity = false;
      p.body.immovable = true;
      var t = this.add.tween(p.position);
      t.to({y: p.position.y - 200}, 3000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
    }, this);

    this.horizontalPlatformsGroup.forEach(function (p) {
      this.game.physics.enable(p, Phaser.Physics.ARCADE);
      p.body.allowGravity = false;
      p.body.immovable = true;
      var t = this.add.tween(p.position);
      t.to({x: p.position.x + 400}, 2000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
    }, this);
  }

  static platformSep(s, platform) {
    if (!s.locked) {
      s.locked = true;
      s.lockedTo = platform;
      s.body.velocity.y = 0;
    }
  }

  update() {
    if (this.boxGroup.countLiving() === 0 && (!this.keySprite || !this.keySprite.alive)) {
      this.hasGreenKey = true;
      this.keySprite = this.game.add.sprite(450, 20, 'green_key');
      this.keySprite.fixedToCamera = true;
      // this.lockerGroup.callAll('kill');
    }

    // Player Collisions
    this.game.physics.arcade.collide(this.playerObject, this.layer, (player, tile) => {
      if (tile.index === 119 && this.playerObject.lastHeartTime < this.game.time.now + 2000) {
        // lava
        player.hitLava();
        this.playerObject.lastHeartTime = this.game.time.now;
      }
      else if (tile.index === 143) {
        // exit?
        alert('Du vinare!')
      }
    });
    this.game.physics.arcade.TILE_BIAS = 40;
    // this.game.physics.arcade.collide(this.bird, this.layer, (bird, tile) => {});
    this.game.physics.arcade.collide(this.playerObject, this.lockerGroup, (player, locker) => {
      if (this.hasGreenKey) {
        this.lockerGroup.callAll('kill');
      }
    });
    /*
     this.game.physics.arcade.collide(this.playerObject, this.bird, (player, bird) => {
     if (this.bird.lastHeartTime < this.game.time.now + 2000) {
     this.game.camera.shake(0.005, 70);
     this.bird.health -= 0.1;
     this.bird.lastHeartTime = this.game.time.now;
     }
     if (this.bird.health < 0) {
     this.bird.kill();
     this.bird = new Bird(this.game, 100, 100);
     }
     });*/
    this.game.physics.arcade.collide(this.playerObject, this.tree.children,
      Player.eatCherry, function () {
      }, this);
    this.game.physics.arcade.overlap(this.playerObject, this.boxGroup,
      Player.takeBox, function () {
      }, this);

    this.playerObject.platformsLockPlayer.call(this);

    // Worm Collisions
    this.game.physics.arcade.collide(this.wormObject, this.layer);
    this.game.physics.arcade.collide(this.slime, this.layer);
    this.game.physics.arcade.overlap(this.wormObject, this.groundGroup,
      Worm.digGroud, function () {
      }, this);
    this.game.physics.arcade.overlap(this.wormObject, this.slime,
      (worm, slime) => {
        this.game.camera.shake(0.005, 70);
        this.playerObject.health -= 0.3;
        slime.kill();
        this.slime = new Slime(this.game, 1000, 800);
        // console.log(slime);
      }, function () {
      }, this);

    // Add new tree
    if (this.tree.checkAllCherriesEaten.call(this)) {
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.addNewTree, this);
    }

    // Movings
    if (this.tabButton.arrow.currentlyControlling === 'player') {
      this.playerObject.move(this.cursors);
    } else {
      this.wormObject.move(this.cursors, this.map, this.layer);
    }

    // this.slime.moveToWorm.call(this);
    // this.bird.moveToTree.call(this);

    // Arrow
    this.tabButton.arrow.updatePosition(this.playerObject, this.wormObject);

    // GameOver
    if (this.playerObject.health < 0) {
      this.game.state.start("GameOver", true, false, this);
    }


    // ugly hack to fix player/worm vertical position
    if (this.playerObject.y > 510) {
      this.playerObject.y = 510;
    }
    if (this.wormObject.y < 600) {
      this.y = 600;
    }
  }

  createTileMap() {
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('ground_1x1');
    this.map.addTilesetImage('kenney');

    this.layer = this.map.createLayer('Tile Layer 1');
    // this.layer.debug = true;
    this.layer.resizeWorld();

    //  Set the tiles for collision.
    //  Do this BEFORE generating the p2 bodies below.
    this.map.setCollisionBetween(1, 200);
    // this.map.setCollisionBetween(141, 142);
    // this.map.setCollisionBetween(100, 118);
  }

  render() {
    var text = this.boxGroup.countLiving() > 0
      ? `left boxes to pickup: ${this.boxGroup.countLiving()} `
      : `You've got a key, go to exit`;
    this.game.debug.text(text, 0, 100);

    this.game.debug.text(`health: ${this.playerObject.health}`, 0, 130);
  }

  addNewTree() {
    if (!this.tree || !this.tree.alive) {
      this.tree = new Tree(this.game);
    }
  }
}

export default Main;
