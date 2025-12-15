import Phaser from "phaser";

export default class CoffeeScene extends Phaser.Scene {
	constructor() {
		super("CoffeeScene");
	}

	create() {
		this.add.text(400, 300, "COFFEE LEVEL", {
			fontSize: "32px",
			color: "#ffffff",
		}).setOrigin(0.5);

		// bouton retour carte
		this.input.keyboard.once("keydown-ESC", () => {
			this.scene.start("WorldMapScene");
		});
	}
}
