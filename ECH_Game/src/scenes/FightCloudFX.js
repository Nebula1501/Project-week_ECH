export default class FightCloudFX {
    constructor(scene, x, y) {
        this._scene = scene;
        this._elapsed = 0;
        this._duration = 700;
        this._x = x;
        this._y = y;

        const puffData = [
            { ox: 0,   oy: 0,   r: 26 },
            { ox: 28,  oy: -18, r: 18 },
            { ox: -28, oy: -16, r: 20 },
            { ox: 20,  oy: 20,  r: 16 },
            { ox: -22, oy: 18,  r: 15 },
            { ox: 0,   oy: -30, r: 13 },
        ];

        this._gfx = scene.add.graphics();
        this._gfx.setDepth(20);
        this._puffData = puffData;
        this._lineAngles = [0, 60, 120, 180, 240, 300].map(d => d * Math.PI / 180);

        this._ticker = scene.time.addEvent({
            delay: 16,
            repeat: Math.ceil(this._duration / 16),
            callback: this._tick,
            callbackScope: this
        });
    }

    _tick() {
        this._elapsed += 16;
        const t = Math.min(this._elapsed / this._duration, 1);
        const alpha = 1 - t;
        const gfx = this._gfx;
        gfx.clear();

        for (const d of this._puffData) {
            const scale = 0.3 + t * 1.4;
            const r = d.r * scale;
            const px = this._x + d.ox * (0.5 + t * 0.8);
            const py = this._y + d.oy * (0.5 + t * 0.8);
            gfx.fillStyle(0xffffff, alpha * 0.85);
            gfx.fillCircle(px, py, r);
            gfx.fillStyle(0xdddddd, alpha * 0.5);
            gfx.fillCircle(px, py, r * 0.5);
        }

        if (t < 0.4) {
            const lineAlpha = (0.4 - t) / 0.4;
            const lineLen = 20 + t * 40;
            gfx.lineStyle(3, 0xffffff, lineAlpha);
            for (const angle of this._lineAngles) {
                const startR = 15;
                gfx.beginPath();
                gfx.moveTo(
                    this._x + Math.cos(angle) * startR,
                    this._y + Math.sin(angle) * startR
                );
                gfx.lineTo(
                    this._x + Math.cos(angle) * (startR + lineLen),
                    this._y + Math.sin(angle) * (startR + lineLen)
                );
                gfx.strokePath();
            }
        }

        if (t < 0.5) {
            const starAlpha = (0.5 - t) / 0.5;
            const starPositions = [
                { ox: 40,  oy: -40 },
                { ox: -40, oy: -40 },
                { ox: 40,  oy: 40  },
                { ox: -40, oy: 40  },
            ];
            gfx.fillStyle(0xffff88, starAlpha);
            for (const sp of starPositions) {
                const sr = 6 + t * 8;
                gfx.fillCircle(
                    this._x + sp.ox * (0.5 + t),
                    this._y + sp.oy * (0.5 + t),
                    sr
                );
            }
        }

        if (t >= 1) {
            gfx.destroy();
            this._ticker.remove();
        }
    }
}
