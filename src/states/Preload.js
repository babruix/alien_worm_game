class Preload extends Phaser.State {

	preload() {
		this.game.load.spritesheet('player', 'assets/p1_spritesheet.png', 73, 96, 16);
		this.game.load.spritesheet('worm', 'assets/worm.png', 140, 140, 2);
		this.game.load.spritesheet('arrow', 'assets/arrow.png', 168, 219, 14);
		this.game.load.spritesheet('tree', 'assets/tree_grows.png', 150, 200, 4);
		this.game.load.spritesheet('ufo', 'assets/ufo_anim.png', 200, 183, 4);
		this.game.load.spritesheet('bird', 'assets/bird.png', 164, 164, 16);
		this.game.load.spritesheet('slime_walk', 'assets/slime_walk.png', 50, 28);
		this.game.load.spritesheet('crystals', 'assets/crystals.png', 141, 141, 3);


		this.game.load.tilemap('map', 'assets/maps/collision test.json', null, Phaser.Tilemap.TILED_JSON);

		this.game.load.image('stone', 'assets/tilemaps/tiles/stone.png');
		this.game.load.image('green_key', 'assets/green_key.png');
		this.game.load.image('locker', 'assets/tilemaps/tiles/locker.png');
		this.game.load.image('mushroom_red', 'assets/tilemaps/tiles/mushroom_red.png');
		this.game.load.image('green_platform', 'assets/tilemaps/tiles/green_platform.png');
		this.game.load.image('ground', 'assets/tilemaps/tiles/ground.png');
		this.game.load.image('box_warn', 'assets/tilemaps/tiles/box_warn.png');
		this.game.load.image('box_orange', 'assets/tilemaps/tiles/box_orange.png');
		this.game.load.image('box_circle', 'assets/tilemaps/tiles/box_circle.png');
		this.game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
		this.game.load.image('kenney', 'assets/tilemaps/tiles/kenney.png');
		this.game.load.image('cherry', 'assets/cherry.png');

		this.game.load.image('ship_manned', 'assets/ship_manned.png');
		this.game.load.image('ship_damage2', 'assets/ship_damage2.png');
		this.game.load.image('ship_damage1', 'assets/ship_damage1.png');
		this.game.load.image('ship_ly', 'assets/ship_fly.png');


		this.game.load.audio('myAudio', 'assets/audio/eat.mp3');
	}

	create() {
		this.game.state.start("GameTitle");
	}

	render() {
		// this.game.debug.text('test?', 100, 80 );
	}

}

export default Preload;
