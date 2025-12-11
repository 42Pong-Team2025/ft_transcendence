import Phaser from "phaser";

export default class WorldMapScene extends Phaser.Scene {
	private player!: Phaser.GameObjects.Sprite;
	private keys!: any;
	private bg!: Phaser.GameObjects.Image;

	private shop!: Phaser.GameObjects.Sprite;
	private hospital!: Phaser.GameObjects.Sprite;
	private house!: Phaser.GameObjects.Sprite;
	private parking!: Phaser.GameObjects.Sprite;
	private coffee!: Phaser.GameObjects.Sprite;

	// Normalized player position
	private playerNX = 0.5;
	private playerNY = 0.5;

	private basePlayerScale = 0.05;

	// Bâtiments : positions normalisées (0–1)
	// Ajuste ces valeurs comme tu veux visuellement
	private posShop  = { x: 0.28, y: 0.34 };
	private posHospital = { x: 0.09, y: 0.32 };
	private posHouse = { x: 0.7, y: 0.19 };
	private posParking = { x: 0.72, y: 0.74 };
	private posCoffee = { x: 0.7, y: 0.58 };

	constructor() {
		super("WorldMapScene");
	}

	preload() {
		this.load.image("map", "/assets/map.png");
		this.load.image("player", "/assets/player.png");
		this.load.image("shop", "/assets/shop.png");
		this.load.image("hospital", "/assets/hospital.png");
		this.load.image("house", "/assets/house.png");
		this.load.image("parking", "/assets/parking.png");
		this.load.image("coffee", "/assets/coffee.png");
	}

	create() {
		this.bg = this.add.image(0, 0, "map").setOrigin(0.5);

		this.player = this.add.sprite(0, 0, "player");

		// Buildings
		this.shop = this.add.sprite(0, 0, "shop");
		this.hospital = this.add.sprite(0, 0, "hospital");
		this.house = this.add.sprite(0, 0, "house");
		this.parking = this.add.sprite(0, 0, "parking");
		this.coffee = this.add.sprite(0, 0, "coffee");

		this.centerScene();

		this.keys = this.input.keyboard.addKeys({
			W: "W",
			A: "A",
			S: "S",
			D: "D",
		});

		this.scale.on("resize", () => this.centerScene());
	}

	private placeBuilding(
		sprite: Phaser.GameObjects.Sprite,
		pos: { x: number; y: number },
		size: number
	) {
		sprite.x = this.bg.x + (pos.x - 0.5) * size;
		sprite.y = this.bg.y + (pos.y - 0.5) * size;

		sprite.setScale(0.6 * (size / 600));
	}

	private makeInteractiveBuilding(sprite: Phaser.GameObjects.Sprite) {
		sprite.setInteractive({ cursor: 'pointer' });

		let isScaling = false;

		sprite.on("pointerover", () => {
			if (isScaling) return;

			isScaling = true;

			this.tweens.add({
				targets: sprite,
				scale: sprite.scale * 1.15,
				duration: 120,
				ease: "Power1",
				onComplete: () => { 
					isScaling = false; 
				}
			});

			sprite.setTint(0xffffcc);
		});

		sprite.on("pointerout", () => {
			if (isScaling) return;

			isScaling = true;

			this.tweens.add({
				targets: sprite,
				scale: Math.max(sprite.scale / 1.15, 0.6), // Assure une taille minimale
				duration: 120,
				ease: "Power1",
				onComplete: () => { 
					isScaling = false; 
				}
			});

			sprite.clearTint();
		});
	}




	centerScene() {
		const size = Math.min(this.scale.width, this.scale.height);

		this.bg.setDisplaySize(size, size);
		this.bg.setPosition(this.scale.width / 2, this.scale.height / 2);

		// Player scale
		const proportionalScale = this.basePlayerScale * (size / 600);
		this.player.setScale(proportionalScale);

		// Player position
		this.player.x = this.bg.x + (this.playerNX - 0.5) * size;
		this.player.y = this.bg.y + (this.playerNY - 0.5) * size;

		// Place buildings dynamically
		this.placeBuilding(this.shop, this.posShop, size);
		this.placeBuilding(this.hospital, this.posHospital, size);
		this.placeBuilding(this.house, this.posHouse, size);
		this.placeBuilding(this.parking, this.posParking, size);
		this.placeBuilding(this.coffee, this.posCoffee, size);
		// Rends les bâtiments interactifs
		this.makeInteractiveBuilding(this.shop);
		this.makeInteractiveBuilding(this.hospital);
		this.makeInteractiveBuilding(this.house);
		this.makeInteractiveBuilding(this.parking);
		this.makeInteractiveBuilding(this.coffee);
	}

	update() {
		const speed = 3;

		let moved = false;

		if (this.keys.W.isDown) { this.playerNY -= speed / 600; moved = true; }
		if (this.keys.S.isDown) { this.playerNY += speed / 600; moved = true; }
		if (this.keys.A.isDown) { this.playerNX -= speed / 600; moved = true; }
		if (this.keys.D.isDown) { this.playerNX += speed / 600; moved = true; }

		if (moved) {
			this.playerNX = Phaser.Math.Clamp(this.playerNX, 0, 1);
			this.playerNY = Phaser.Math.Clamp(this.playerNY, 0, 1);
			this.centerScene();
		}
	}
}
