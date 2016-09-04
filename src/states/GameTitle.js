import RainbowText from "../objects/RainbowText";
class GameTitle extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY };
		let text = `Alien
Worm
Game
(click to start)`;
		this.RainbowText = new RainbowText(this.game, center.x, center.y, text);
		this.RainbowText.anchor.set(0.5);
		this.game.input.onDown.addOnce(this.startGame, this);

		this.game.time.events.add(Phaser.Timer.SECOND * 0, this.startGame, this);
	}

	startGame() {
		this.RainbowText.destroy();
		this.game.state.start("Main");
	}

}

export default GameTitle;
