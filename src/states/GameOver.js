import RainbowText from "../objects/RainbowText";
class GameOver extends Phaser.State {

	init(Main) {
		Main.tree.kill();
		Main.bird.kill();
		// Main.slime.kill();
		// Main.ufo.kill();
		// Main.ship.kill();
		if (Main.keySprite) {
			Main.keySprite.kill();
		}
		Main.tree.children.forEach(function (cherry) {
			cherry.kill();
		});
		Main.tabButton.arrow.kill();
	}

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY };
		let text = `Game
OVER
!!!
 (click to start)`;
		this.RainbowText = new RainbowText(this.game, center.x, center.y, text);
		this.RainbowText.anchor.set(0.5);
		this.game.input.onDown.addOnce(this.restartGame, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 2, this.restartGame, this);
	}

	restartGame() {
		this.RainbowText.kill();
		this.game.state.start("Main");
	}

}

export default GameOver;
