import { SIZE, OCEAN, SHIP, HIT } from './constants.js';

export class AI {
    constructor() {
        this.lastHit = null;
        this.potentialTargets = [];
        this.guessedPositions = new Set();
    }

    getNextMove(board) {
        // If we have a hit, try adjacent cells
        if (this.lastHit) {
            const target = this.getSmartTarget(board);
            if (target) return target;
        }

        // If no smart moves, try random position
        return this.getRandomPosition(board);
    }

    getSmartTarget(board) {
        // Generate adjacent positions if needed
        if (this.potentialTargets.length === 0 && this.lastHit) {
            const [row, col] = this.lastHit;
            const adjacent = [
                [row - 1, col], [row + 1, col],
                [row, col - 1], [row, col + 1]
            ];
            
            this.potentialTargets = adjacent.filter(([r, c]) => 
                r >= 0 && r < SIZE && c >= 0 && c < SIZE &&
                !this.guessedPositions.has(`${r},${c}`)
            );
        }

        // Try next potential target
        if (this.potentialTargets.length > 0) {
            const target = this.potentialTargets.pop();
            this.guessedPositions.add(`${target[0]},${target[1]}`);
            return target;
        }

        this.lastHit = null;
        return null;
    }

    getRandomPosition(board) {
        let row, col;
        do {
            row = Math.floor(Math.random() * SIZE);
            col = Math.floor(Math.random() * SIZE);
        } while (this.guessedPositions.has(`${row},${col}`));

        this.guessedPositions.add(`${row},${col}`);
        return [row, col];
    }

    handleResult(row, col, wasHit) {
        if (wasHit) {
            this.lastHit = [row, col];
        }
    }
}