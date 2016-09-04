class Boot extends Phaser.State {

	preload() {

	}

	init(args) {
		// Set scale options
		this.game.input.maxPointers = 1; // No multi-touch
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
	}

	create() {
		this.game.state.start("Preload");
	}

}

export default Boot;