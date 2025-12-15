import Phaser from "phaser";

export default class WorldMapScene extends Phaser.Scene {
	private player!: Phaser.GameObjects.Sprite;
	private bg!: Phaser.GameObjects.Image;

	private shop!: Phaser.GameObjects.Sprite;
	private hospital!: Phaser.GameObjects.Sprite;
	private house!: Phaser.GameObjects.Sprite;
	private parking!: Phaser.GameObjects.Sprite;
	private coffee!: Phaser.GameObjects.Sprite;

	// Normalized player position (0–1)
	private playerNX = 0.5;
	private playerNY = 0.5;

	private basePlayerScale = 0.3;

	// Normalized building positions
	private posShop = { x: 0.28, y: 0.34 };
	private posHospital = { x: 0.09, y: 0.32 };
	private posHouse = { x: 0.7, y: 0.19 };
	private posParking = { x: 0.72, y: 0.74 };
	private posCoffee = { x: 0.7, y: 0.58 };

	constructor() {
		super("WorldMapScene");
	}

	preload() {
		this.load.image("map", "/assets/map.png");
		this.load.image("shop", "/assets/buildings/shop.png");
		this.load.image("hospital", "/assets/buildings/hospital.png");
		this.load.image("house", "/assets/buildings/house.png");
		this.load.image("parking", "/assets/buildings/parking.png");
		this.load.image("coffee", "/assets/buildings/coffee.png");
		for (let i = 1; i <= 8; i++) {
			if (i <= 5) {
				this.load.image(`nurse-up-${i}`, `/assets/nurse/nurse_up/nurseu${i}.png`);
			}
			this.load.image(`nurse-down-${i}`, `/assets/nurse/nurse_down/nursed${i}.png`);
			this.load.image(`nurse-left-${i}`, `/assets/nurse/nurse_left/nursel${i}.png`);
			this.load.image(`nurse-right-${i}`, `/assets/nurse/nurse_right/nurser${i}.png`);
		}
	}

	create() {
		this.bg = this.add.image(0, 0, "map").setOrigin(0.5);
		this.player = this.add.sprite(0, 0, "nurse-down-1");

		this.shop = this.add.sprite(0, 0, "shop");
		this.hospital = this.add.sprite(0, 0, "hospital");
		this.house = this.add.sprite(0, 0, "house");
		this.parking = this.add.sprite(0, 0, "parking");
		this.coffee = this.add.sprite(0, 0, "coffee");

		this.centerScene();


		this.scale.on("resize", () => this.centerScene());
		this.createNurseAnimations();
	}

	// Places a building using normalized coordinates relative to the map
	private placeBuilding(
		sprite: Phaser.GameObjects.Sprite,
		pos: { x: number; y: number },
		size: number
	) {
		sprite.x = this.bg.x + (pos.x - 0.5) * size;
		sprite.y = this.bg.y + (pos.y - 0.5) * size;

		const baseScale = 0.6 * (size / 600);
		sprite.setScale(baseScale);

		// Store base scale for hover animations
		sprite.setData("baseScale", baseScale);
	}

	// Adds a safe hover animation that cannot desync
	private makeInteractiveBuilding(sprite: Phaser.GameObjects.Sprite) {
		sprite.setInteractive({ cursor: "pointer" });

		sprite.on("pointerover", () => {
			const baseScale = sprite.getData("baseScale");

			sprite.clearTint();
			this.tweens.killTweensOf(sprite);

			this.tweens.add({
				targets: sprite,
				scale: baseScale * 1.15,
				duration: 120,
				ease: "Power1",
			});

			sprite.setTint(0xffffcc);
		});

		sprite.on("pointerout", () => {
			const baseScale = sprite.getData("baseScale");

			this.tweens.killTweensOf(sprite);

			this.tweens.add({
				targets: sprite,
				scale: baseScale,
				duration: 120,
				ease: "Power1",
			});

			sprite.clearTint();
		});
	}

	private createNurseAnimations() {
		this.anims.create({
			key: "nurse-down",
			frames: [
				{ key: "nurse-down-1" },
				{ key: "nurse-down-2" },
				{ key: "nurse-down-3" },
				{ key: "nurse-down-4" },
				{ key: "nurse-down-5" },
				{ key: "nurse-down-6" },
				{ key: "nurse-down-7" },
				{ key: "nurse-down-8" },
			],
			frameRate: 8,
			repeat: -1,
		});

		this.anims.create({
			key: "nurse-left",
			frames: [
				{ key: "nurse-left-1" },
				{ key: "nurse-left-2" },
				{ key: "nurse-left-3" },
				{ key: "nurse-left-4" },
				{ key: "nurse-left-5" },
				{ key: "nurse-left-6" },
				{ key: "nurse-left-7" },
				{ key: "nurse-left-8" },
			],
			frameRate: 8,
			repeat: -1,
		});

		this.anims.create({
			key: "nurse-right",
			frames: [
				{ key: "nurse-right-1" },
				{ key: "nurse-right-2" },
				{ key: "nurse-right-3" },
				{ key: "nurse-right-4" },
				{ key: "nurse-right-5" },
				{ key: "nurse-right-6" },
				{ key: "nurse-right-7" },
				{ key: "nurse-right-8" },
			],
			frameRate: 8,
			repeat: -1,
		});

		this.anims.create({
			key: "nurse-up",
			frames: [
				{ key: "nurse-up-1" },
				{ key: "nurse-up-2" },
				{ key: "nurse-up-3" },
				{ key: "nurse-up-4" },
				{ key: "nurse-up-5" },
			],
			frameRate: 8,
			repeat: -1,
		});
	}

	// Recomputes layout when screen size or player position changes
	centerScene() {
		const size = Math.min(this.scale.width, this.scale.height);

		this.bg.setDisplaySize(size, size);
		this.bg.setPosition(this.scale.width / 2, this.scale.height / 2);

		const playerScale = this.basePlayerScale * (size / 600);
		this.player.setScale(playerScale);

		this.player.x = this.bg.x + (this.playerNX - 0.5) * size;
		this.player.y = this.bg.y + (this.playerNY - 0.5) * size;

		this.placeBuilding(this.shop, this.posShop, size);
		this.placeBuilding(this.hospital, this.posHospital, size);
		this.placeBuilding(this.house, this.posHouse, size);
		this.placeBuilding(this.parking, this.posParking, size);
		this.placeBuilding(this.coffee, this.posCoffee, size);

		this.makeInteractiveBuilding(this.shop);
		this.makeInteractiveBuilding(this.hospital);
		this.makeInteractiveBuilding(this.house);
		this.makeInteractiveBuilding(this.parking);
		this.makeInteractiveBuilding(this.coffee);
	}

	update() {
		let moved = false;

		if (moved) {
			this.playerNX = Phaser.Math.Clamp(this.playerNX, 0, 1);
			this.playerNY = Phaser.Math.Clamp(this.playerNY, 0, 1);
			this.centerScene();
		}
	}
}
