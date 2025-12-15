import Phaser from "phaser";
import type { CoffeeEvent, ZoneName } from "../types/CoffeeEvents";

interface ThoughtData {
    id: string;
    text: string;
}

interface ThoughtCard extends Phaser.GameObjects.Text {
    thoughtId: string;
    spawnTime: number;
    currentZone: ZoneName;
    moves: number;
}

interface ZoneView {
    name: Exclude<ZoneName, "floating">;
    nx: number;
    ny: number;
    width: number;
    height: number;
    bg: Phaser.GameObjects.Rectangle;
    label: Phaser.GameObjects.Text;
}

export default class CoffeeScene extends Phaser.Scene {
    private canvasBg!: Phaser.GameObjects.Rectangle;

    private zones!: Record<"important" | "not_important", ZoneView>;
    private thoughtsQueue: ThoughtData[] = [];
    private activeCards: ThoughtCard[] = [];

    constructor() {
        super("CoffeeScene");
    }

    /* ================= Lifecycle ================= */

    create(): void {
        this.createCanvas();
        this.createZones();
        this.loadThoughts();

        this.scale.on("resize", () => this.centerScene());

        this.spawnThoughts();
        this.centerScene();
    }

    /* ================= Canvas ================= */

    /**
     * Logical centered canvas, similar to WorldMapScene.
     * Everything is positioned relative to this area.
     */
    private createCanvas(): void {
        this.canvasBg = this.add.rectangle(0, 0, 10, 10, 0x1e1e1e);
        this.canvasBg.setOrigin(0.5);
        this.canvasBg.setDepth(0);
    }

    /* ================= Zones ================= */

    private createZones(): void {
        this.zones = {
            important: this.createZone(
                "important",
                "Important",
                0.25,
                0.75
            ),
            not_important: this.createZone(
                "not_important",
                "Not important",
                0.75,
                0.75
            ),
        };
    }

    private createZone(
        name: ZoneView["name"],
        labelText: string,
        nx: number,
        ny: number
    ): ZoneView {
        const bg = this.add.rectangle(0, 0, 260, 120, 0x2f2f2f);
        bg.setStrokeStyle(3, 0xffffff);
        bg.setDepth(1);

        const label = this.add.text(0, 0, labelText, {
            fontFamily: "GameFont",
            fontSize: "18px",
            color: "#ffffff",
        }).setOrigin(0.5);

        label.setDepth(2);

        return {
            name,
            nx,
            ny,
            width: 260,
            height: 120,
            bg,
            label,
        };
    }

    /* ================= Thoughts ================= */

    private loadThoughts(): void {
        this.thoughtsQueue = [
            { id: "t1", text: "I should not have said that" },
            { id: "t2", text: "I feel tired" },
            { id: "t3", text: "This will pass" },
            { id: "t4", text: "I need to focus" },
        ];
    }

    private spawnThoughts(): void {
        this.thoughtsQueue.forEach((thought, index) => {
            this.time.delayedCall(1400 * index, () => {
                const card = this.createThoughtCard(thought);
                this.activeCards.push(card);

                this.emitEvent({
                    type: "THOUGHT_SHOWN",
                    payload: { thoughtId: thought.id },
                });

                this.centerScene();
            });
        });
    }

    private createThoughtCard(thought: ThoughtData): ThoughtCard {
        const card = this.add.text(0, 0, thought.text, {
            fontFamily: "GameFont",
            fontSize: "18px",
            backgroundColor: "#ffffff",
            color: "#000000",
            padding: { x: 12, y: 8 },
            wordWrap: { width: 220 },
        }) as ThoughtCard;

        card.setOrigin(0.5);
        card.setDepth(5);

        card.thoughtId = thought.id;
        card.spawnTime = Date.now();
        card.currentZone = "floating";
        card.moves = 0;

        card.setInteractive({ draggable: true });
        this.input.setDraggable(card);

        this.input.on("drag", (_, obj, x, y) => {
            if (obj === card) {
                card.setPosition(x, y);
            }
        });

        this.input.on("dragend", (_, obj) => {
            if (obj !== card) return;

            const zone = this.getZoneUnder(card);
            if (!zone) return;

            const prev = card.currentZone;
            card.currentZone = zone.name;
            card.moves++;

            this.emitEvent({
                type: "THOUGHT_MOVED",
                payload: {
                    thoughtId: card.thoughtId,
                    from: prev,
                    to: zone.name,
                    moves: card.moves,
                    timeToDecisionMs: Date.now() - card.spawnTime,
                },
            });

            this.centerScene();
        });

        return card;
    }

    /* ================= Layout ================= */

    /**
     * Recomputes layout without recreating objects.
     * Same philosophy as WorldMapScene.centerScene().
     */
    private centerScene(): void {
        const size = Math.min(this.scale.width, this.scale.height);

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        this.canvasBg.setSize(size, size);
        this.canvasBg.setPosition(cx, cy);

        // Zones
        Object.values(this.zones).forEach(zone => {
            const x = cx + (zone.nx - 0.5) * size;
            const y = cy + (zone.ny - 0.5) * size;

            zone.bg.setPosition(x, y);
            zone.label.setPosition(x, y - zone.height / 2 - 14);
        });

        // Cards
        this.activeCards.forEach((card, index) => {
            if (card.currentZone === "floating") {
                card.setPosition(
                    cx + (index * 40) - 60,
                    cy - size * 0.15
                );
            } else {
                const zone = this.zones[card.currentZone];
                card.setPosition(zone.bg.x, zone.bg.y);
            }
        });
    }

    /* ================= Utils ================= */

    private getZoneUnder(card: Phaser.GameObjects.Text): ZoneView | null {
        for (const zone of Object.values(this.zones)) {
            const r = zone.bg.getBounds();
            if (r.contains(card.x, card.y)) {
                return zone;
            }
        }
        return null;
    }

    private emitEvent(event: CoffeeEvent): void {
        // To be replaced by WS / authoritative server
        console.log("[COFFEE EVENT]", event);
    }
}
