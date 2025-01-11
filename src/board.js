import { SIZE, CELL_SIZE, OCEAN, COLORS, HIT, FIRE } from './constants.js';

export class Board {
    constructor(canvas, isPlayer = true) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isPlayer = isPlayer;
        this.grid = Array(SIZE).fill().map(() => Array(SIZE).fill(OCEAN));
        
        this.canvas.width = SIZE * CELL_SIZE;
        this.canvas.height = SIZE * CELL_SIZE;
        
        // Draw initial grid
        this.drawGrid();
    }

    drawGrid() {
        // Draw grid lines
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= SIZE; i++) {
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * CELL_SIZE, 0);
            this.ctx.lineTo(i * CELL_SIZE, SIZE * CELL_SIZE);
            this.ctx.stroke();
            
            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * CELL_SIZE);
            this.ctx.lineTo(SIZE * CELL_SIZE, i * CELL_SIZE);
            this.ctx.stroke();
            
            // Draw coordinates
            if (i < SIZE) {
                this.ctx.fillStyle = '#666';
                this.ctx.font = '12px Arial';
                // Column letters
                this.ctx.fillText(String.fromCharCode(65 + i), 
                    i * CELL_SIZE + 5, 15);
                // Row numbers
                this.ctx.fillText((i + 1).toString(), 
                    5, i * CELL_SIZE + 15);
            }
        }
    }

    draw(reveal = false) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        
        // Draw cells
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                const cell = this.grid[row][col];
                
                // Only show cells for player's board or revealed shots on enemy board
                if (this.isPlayer || (!this.isPlayer && (cell === HIT || cell === FIRE))) {
                    const color = COLORS[cell];
                    
                    if (cell !== OCEAN) {
                        this.ctx.fillStyle = color;
                        this.ctx.fillRect(
                            col * CELL_SIZE + 1,
                            row * CELL_SIZE + 1,
                            CELL_SIZE - 2,
                            CELL_SIZE - 2
                        );
                    }
                    
                    if (cell === HIT || cell === FIRE) {
                        this.drawMarker(col * CELL_SIZE, row * CELL_SIZE, cell);
                    }
                } else if (!this.isPlayer) {
                    // Draw fog of war effect for enemy board
                    this.ctx.fillStyle = '#1a1a1a';
                    this.ctx.fillRect(
                        col * CELL_SIZE + 1,
                        row * CELL_SIZE + 1,
                        CELL_SIZE - 2,
                        CELL_SIZE - 2
                    );
                }
            }
        }
    }

    drawMarker(x, y, type) {
        if (type === HIT) {
            this.drawX(x, y);
        } else if (type === FIRE) {
            this.drawDot(x, y);
        }
    }

    drawX(x, y) {
        const margin = CELL_SIZE / 4;
        this.ctx.strokeStyle = '#C00';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + margin, y + margin);
        this.ctx.lineTo(x + CELL_SIZE - margin, y + CELL_SIZE - margin);
        this.ctx.moveTo(x + CELL_SIZE - margin, y + margin);
        this.ctx.lineTo(x + margin, y + CELL_SIZE - margin);
        this.ctx.stroke();
    }

    drawDot(x, y) {
        this.ctx.fillStyle = '#666';
        this.ctx.beginPath();
        this.ctx.arc(
            x + CELL_SIZE / 2,
            y + CELL_SIZE / 2,
            CELL_SIZE / 6,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    getGridPosition(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        const col = Math.floor((x - rect.left) / CELL_SIZE);
        const row = Math.floor((y - rect.top) / CELL_SIZE);
        return { row, col };
    }
}