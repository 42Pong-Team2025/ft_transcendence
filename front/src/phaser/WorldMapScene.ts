import Phaser from "phaser";

export default class WorldMapScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Sprite;
    private keys!: any;
    private bg!: Phaser.GameObjects.Image;

    // Normalized position (0–1) inside the map
    private playerNX = 0.5;
    private playerNY = 0.5;

    // Base scale reference for the player
    private basePlayerScale = 0.05;

    constructor() {
        super("WorldMapScene");
    }

    preload() {
        this.load.image("map", "/assets/map.png");
        this.load.image("player", "/assets/player.png");
    }

    create() {
        this.bg = this.add.image(0, 0, "map").setOrigin(0.5);

        this.player = this.add.sprite(0, 0, "player");

        this.centerScene();

        this.keys = this.input.keyboard.addKeys({
            W: "W",
            A: "A",
            S: "S",
            D: "D",
        });

        this.scale.on("resize", () => this.centerScene());
    }

    centerScene() {
        const size = Math.min(this.scale.width, this.scale.height);

        // Resize the map
        this.bg.setDisplaySize(size, size);
        this.bg.setPosition(this.scale.width / 2, this.scale.height / 2);

        // Rescale player proportionally
        const proportionalScale = this.basePlayerScale * (size / 600);
        this.player.setScale(proportionalScale);

        // Reposition player based on normalized coords
        this.player.x = this.bg.x + (this.playerNX - 0.5) * size;
        this.player.y = this.bg.y + (this.playerNY - 0.5) * size;
    }

    update() {
        const speed = 3;

        let moved = false;

        if (this.keys.W.isDown) { this.playerNY -= speed / 600; moved = true; }
        if (this.keys.S.isDown) { this.playerNY += speed / 600; moved = true; }
        if (this.keys.A.isDown) { this.playerNX -= speed / 600; moved = true; }
        if (this.keys.D.isDown) { this.playerNX += speed / 600; moved = true; }

        // Clamp between 0 and 1
        if (moved) {
            this.playerNX = Phaser.Math.Clamp(this.playerNX, 0, 1);
            this.playerNY = Phaser.Math.Clamp(this.playerNY, 0, 1);
            this.centerScene();
        }
    }
}
